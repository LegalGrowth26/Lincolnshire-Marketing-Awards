'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/supabase'
import { requireAdmin, ADMIN_COOKIE } from '@/lib/auth'
import { setSetting } from '@/lib/config'
import { runDailyJobs, type JobReport } from '@/lib/jobs'
import { refreshOrderCompletion } from '@/lib/orders'

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
  const supabase = db()

  const { data: categories } = await supabase.from('categories').select('id, slug, title')
  const cats = categories ?? []

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

    const existing = await supabase
      .from('shortlist')
      .select('id')
      .eq('category_id', cat.id)
      .ilike('email', email)
      .maybeSingle()

    const payload = {
      category_id: cat.id,
      company_name: row.company_name.trim(),
      contact_name: row.contact_name?.trim() || null,
      email,
      phone: row.phone?.trim() || null,
      import_batch: batch,
    }

    let shortlistId: string
    if (existing.data) {
      await supabase.from('shortlist').update(payload).eq('id', existing.data.id)
      shortlistId = existing.data.id
      report.updated++
    } else {
      const ins = await supabase.from('shortlist').insert(payload).select('id').single()
      if (ins.error || !ins.data) {
        report.skipped.push({ row: i + 2, reason: ins.error?.message ?? 'Insert failed' })
        continue
      }
      shortlistId = ins.data.id
      report.created++
    }

    const score = row.score !== undefined && row.score !== '' ? Number(row.score) : null
    const placement = matchPlacement(row.placement)
    if (score !== null || placement) {
      await supabase.from('shortlist_results').upsert(
        {
          shortlist_id: shortlistId,
          score: Number.isFinite(score) ? score : null,
          placement,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'shortlist_id' },
      )
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
  await db().from('shortlist').update({ is_shortlisted: value }).in('id', ids)
  revalidatePath('/admin/shortlist')
  revalidatePath('/admin')
}

/** Queues the congratulations email. The daily cron does the sending. */
export async function armInvites(ids: string[]) {
  await requireAdmin()
  const { count } = await db()
    .from('shortlist')
    .update({ invite_state: 'armed' }, { count: 'exact' })
    .in('id', ids)
    .eq('is_shortlisted', true)
    .in('invite_state', ['draft', 'suppressed'])
  revalidatePath('/admin/shortlist')
  return { armed: count ?? 0 }
}

export async function suppressInvites(ids: string[]) {
  await requireAdmin()
  await db()
    .from('shortlist')
    .update({ invite_state: 'suppressed' })
    .in('id', ids)
    .in('invite_state', ['draft', 'armed'])
  revalidatePath('/admin/shortlist')
}

export async function deleteShortlistRow(id: string) {
  await requireAdmin()
  await db().from('shortlist').delete().eq('id', id)
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
  const supabase = db()
  const { data: guest } = await supabase
    .from('guests')
    .select('order_id')
    .eq('id', guestId)
    .single()

  await supabase
    .from('guests')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', guestId)

  if (guest?.order_id) await refreshOrderCompletion(guest.order_id)

  revalidatePath('/admin/guests')
  revalidatePath('/admin')
}

export async function setOrderStatus(orderId: string, status: 'paid' | 'refunded' | 'cancelled') {
  await requireAdmin()
  await db().from('orders').update({ status }).eq('id', orderId)
  revalidatePath('/admin')
  revalidatePath('/admin/guests')
}

/** Fix a mis-mapped seat count without touching Stripe. */
export async function setOrderSeats(orderId: string, seats: number) {
  await requireAdmin()
  if (!Number.isInteger(seats) || seats < 1 || seats > 40) return
  const supabase = db()
  await supabase.from('orders').update({ seats }).eq('id', orderId)

  const existing = await supabase.from('guests').select('seat_number').eq('order_id', orderId)
  const have = new Set((existing.data ?? []).map((g) => g.seat_number))
  const toAdd = []
  for (let n = 1; n <= seats; n++) {
    if (!have.has(n)) toAdd.push({ order_id: orderId, seat_number: n, is_buyer: n === 1 })
  }
  if (toAdd.length) await supabase.from('guests').insert(toAdd)
  await supabase.from('guests').delete().eq('order_id', orderId).gt('seat_number', seats)

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
