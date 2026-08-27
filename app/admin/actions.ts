'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { requireAdmin, ADMIN_COOKIE } from '@/lib/auth'
import { setSetting } from '@/lib/config'
import { runDailyJobs, type JobReport } from '@/lib/jobs'
import { refreshOrderCompletion, syncFromStripe, type StripeSyncResult } from '@/lib/orders'

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export async function logout() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}

// ---------------------------------------------------------------------------
// Shortlist
// ---------------------------------------------------------------------------

export type ImportRow = {
  category: string
  company_name: string
  contact_name?: string
  email: string
  phone?: string
  score?: string
  placement?: string
}

export type ImportReport = {
  created: number
  updated: number
  skipped: { row: number; reason: string }[]
  perCategory: { category: string; count: number }[]
  batch: string
}

function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function matchPlacement(v: string | undefined) {
  if (!v) return null
  const n = normalise(v)
  if (n.includes('winner') || n === '1' || n === '1st') return 'winner'
  if (n.includes('highlycommended') || n.includes('commended') || n === '2' || n === '2nd') {
    return 'highly_commended'
  }
  return 'finalist'
}

/**
 * Upserts the shortlist spreadsheet. Scores and placement go into
 * shortlist_results, which nothing outside the admin area ever reads.
 */
export async function importShortlist(rows: ImportRow[]): Promise<ImportReport> {
  await requireAdmin()

  const cats = await sql`select id, slug, title from categories`

  const batch = crypto.randomUUID()
  const report: ImportReport = {
    created: 0,
    updated: 0,
    skipped: [],
    perCategory: [],
    batch,
  }
  const counts = new Map<string, number>()

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const email = (row.email || '').trim().toLowerCase()

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      report.skipped.push({ row: i + 2, reason: `Invalid email "${row.email ?? ''}"` })
      continue
    }
    if (!row.company_name?.trim()) {
      report.skipped.push({ row: i + 2, reason: 'Missing company name' })
      continue
    }

    const raw = (row.category || '').trim()
    const n = normalise(raw)
    const cat =
      cats.find((c) => normalise(c.slug) === n) ||
      cats.find((c) => normalise(c.title) === n) ||
      cats.find((c) => String(c.id) === raw.replace(/^0+/, '')) ||
      cats.find((c) => n.length > 3 && normalise(c.title).includes(n))

    if (!cat) {
      report.skipped.push({ row: i + 2, reason: `Unrecognised category "${raw}"` })
      continue
    }

    const existing = await sql`
      select id from shortlist
      where category_id = ${cat.id} and lower(email) = lower(${email})`

    const companyName = row.company_name.trim()
    const contactName = row.contact_name?.trim() || null
    const phone = row.phone?.trim() || null

    let shortlistId: string
    if (existing[0]) {
      await sql`
        update shortlist
        set category_id = ${cat.id}, company_name = ${companyName},
            contact_name = ${contactName}, email = ${email}, phone = ${phone},
            import_batch = ${batch}
        where id = ${existing[0].id}`
      shortlistId = existing[0].id
      report.updated++
    } else {
      let ins: { id: string } | undefined
      try {
        const inserted = await sql`
          insert into shortlist (category_id, company_name, contact_name, email, phone, import_batch)
          values (${cat.id}, ${companyName}, ${contactName}, ${email}, ${phone}, ${batch})
          returning id`
        ins = inserted[0]
      } catch (e) {
        report.skipped.push({
          row: i + 2,
          reason: e instanceof Error ? e.message : 'Insert failed',
        })
        continue
      }
      if (!ins) {
        report.skipped.push({ row: i + 2, reason: 'Insert failed' })
        continue
      }
      shortlistId = ins.id
      report.created++
    }

    const score = row.score !== undefined && row.score !== '' ? Number(row.score) : null
    const placement = matchPlacement(row.placement)
    if (score !== null || placement) {
      await sql`
        insert into shortlist_results (shortlist_id, score, placement, updated_at)
        values (${shortlistId}, ${Number.isFinite(score) ? score : null}, ${placement},
                ${new Date().toISOString()})
        on conflict (shortlist_id) do update
          set score = excluded.score, placement = excluded.placement,
              updated_at = excluded.updated_at`
    }

    counts.set(cat.title, (counts.get(cat.title) ?? 0) + 1)
  }

  report.perCategory = [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category))

  revalidatePath('/admin/shortlist')
  revalidatePath('/admin')
  return report
}

export async function setShortlisted(ids: string[], value: boolean) {
  await requireAdmin()
  await sql`
    update shortlist set is_shortlisted = ${value}
    where id = any(${ids}::uuid[])`
  revalidatePath('/admin/shortlist')
  revalidatePath('/admin')
}

/** Queues the congratulations email. The daily cron does the sending. */
export async function armInvites(ids: string[]) {
  await requireAdmin()
  const armed = await sql`
    update shortlist set invite_state = 'armed'
    where id = any(${ids}::uuid[])
      and is_shortlisted = true
      and invite_state in ('draft', 'suppressed')
    returning id`
  revalidatePath('/admin/shortlist')
  return { armed: armed.length }
}

export async function suppressInvites(ids: string[]) {
  await requireAdmin()
  await sql`
    update shortlist set invite_state = 'suppressed'
    where id = any(${ids}::uuid[])
      and invite_state in ('draft', 'armed')`
  revalidatePath('/admin/shortlist')
}

export async function deleteShortlistRow(id: string) {
  await requireAdmin()
  await sql`delete from shortlist where id = ${id}`
  revalidatePath('/admin/shortlist')
}

// ---------------------------------------------------------------------------
// Guests
// ---------------------------------------------------------------------------

export async function updateGuest(
  guestId: string,
  patch: {
    full_name?: string
    company?: string
    dietary_tags?: string[]
    dietary_notes?: string
    accessibility_notes?: string
  },
) {
  await requireAdmin()
  const guests = await sql`select order_id from guests where id = ${guestId}`
  const guest = guests[0]

  // Only the fields present on the patch are written; the CASE guards keep
  // absent fields untouched, matching the previous partial-update semantics.
  await sql`
    update guests set
      full_name = case when ${patch.full_name !== undefined}
        then ${patch.full_name ?? null} else full_name end,
      company = case when ${patch.company !== undefined}
        then ${patch.company ?? null} else company end,
      dietary_tags = case when ${patch.dietary_tags !== undefined}
        then ${patch.dietary_tags ?? null}::text[] else dietary_tags end,
      dietary_notes = case when ${patch.dietary_notes !== undefined}
        then ${patch.dietary_notes ?? null} else dietary_notes end,
      accessibility_notes = case when ${patch.accessibility_notes !== undefined}
        then ${patch.accessibility_notes ?? null} else accessibility_notes end,
      updated_at = ${new Date().toISOString()}
    where id = ${guestId}`

  if (guest?.order_id) await refreshOrderCompletion(guest.order_id)

  revalidatePath('/admin/guests')
  revalidatePath('/admin')
}

/** Abandon a details-first checkout that never paid. Only touches 'pending'. */
export async function cancelPendingOrder(orderId: string) {
  await requireAdmin()
  await sql`
    update orders set status = 'cancelled'
    where id = ${orderId} and status = 'pending'`
  revalidatePath('/admin')
  revalidatePath('/admin/guests')
}

export async function setOrderStatus(orderId: string, status: 'paid' | 'refunded' | 'cancelled') {
  await requireAdmin()
  await sql`update orders set status = ${status} where id = ${orderId}`
  revalidatePath('/admin')
  revalidatePath('/admin/guests')
}

/** Fix a mis-mapped seat count without touching Stripe. */
export async function setOrderSeats(orderId: string, seats: number) {
  await requireAdmin()
  if (!Number.isInteger(seats) || seats < 1 || seats > 40) return
  await sql`update orders set seats = ${seats} where id = ${orderId}`

  const existing = await sql`select seat_number from guests where order_id = ${orderId}`
  const have = new Set(existing.map((g) => g.seat_number))
  const toAdd = []
  for (let n = 1; n <= seats; n++) {
    if (!have.has(n)) toAdd.push(n)
  }
  if (toAdd.length) {
    await sql`
      insert into guests (order_id, seat_number, is_buyer)
      select ${orderId}, n, n = 1 from unnest(${toAdd}::int[]) as n`
  }
  await sql`
    delete from guests where order_id = ${orderId} and seat_number > ${seats}`

  await refreshOrderCompletion(orderId)
  revalidatePath('/admin')
  revalidatePath('/admin/guests')
}

// ---------------------------------------------------------------------------
// Settings and automation
// ---------------------------------------------------------------------------

export async function saveSettings(form: FormData) {
  await requireAdmin()
  const str = (k: string) => String(form.get(k) ?? '').trim()
  const nums = (k: string) =>
    str(k)
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => Number.isFinite(v) && v >= 0)

  await Promise.all([
    setSetting('event_date', str('event_date')),
    setSetting('venue', str('venue')),
    setSetting('arrival_time', str('arrival_time')),
    setSetting('dress_code', str('dress_code')),
    setSetting('capacity_seats', Number(str('capacity_seats')) || 200),
    setSetting('automation_enabled', form.get('automation_enabled') === 'on'),
    setSetting('invite_reminder_days', nums('invite_reminder_days')),
    setSetting('details_chase_days', nums('details_chase_days')),
    setSetting('plan_email_days_before', Number(str('plan_email_days_before')) || 7),
  ])

  revalidatePath('/admin/settings')
  revalidatePath('/admin')
}

/** Runs the daily pass immediately, ignoring the master switch. */
export async function runJobsNow(): Promise<JobReport> {
  await requireAdmin()
  const report = await runDailyJobs(true)
  revalidatePath('/admin')
  revalidatePath('/admin/shortlist')
  return report
}

/** Reconcile Stripe payments on demand, without touching the email jobs. */
export async function syncStripeNow(): Promise<StripeSyncResult> {
  await requireAdmin()
  try {
    const result = await syncFromStripe()
    revalidatePath('/admin')
    revalidatePath('/admin/guests')
    return result
  } catch (e) {
    return {
      checked: 0,
      markedPaid: 0,
      created: 0,
      error: e instanceof Error ? e.message : String(e),
    }
  }
}
