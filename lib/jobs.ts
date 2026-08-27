import 'server-only'
import { sql } from './db'
import {
  getSettings,
  siteUrl,
  ticketUrls,
  formatEventDate,
  daysUntil,
  type Settings,
} from './config'
import { sendTemplate } from './email'
import { firstName, syncFromStripe, type StripeSyncResult } from './orders'

export type JobReport = {
  ranAt: string
  automationEnabled: boolean
  stripeSync: StripeSyncResult
  invites: TaskResult
  reminders: TaskResult
  chases: TaskResult
  plan: TaskResult
}

type TaskResult = { sent: number; skipped: number; failed: number; error?: string }
const empty = (): TaskResult => ({ sent: 0, skipped: 0, failed: 0 })

/**
 * One daily pass. Every task is independently wrapped, so one failure never
 * stops the others. Everything is deduped in email_log, so running this twice
 * in a day sends nothing the second time.
 */
export async function runDailyJobs(force = false): Promise<JobReport> {
  const settings = await getSettings()
  const report: JobReport = {
    ranAt: new Date().toISOString(),
    automationEnabled: settings.automation_enabled,
    stripeSync: { checked: 0, markedPaid: 0, created: 0 },
    invites: empty(),
    reminders: empty(),
    chases: empty(),
    plan: empty(),
  }

  // Reconcile payments before the automation gate: this records money, not
  // email, so it runs even while the email master switch is off.
  try {
    report.stripeSync = await syncFromStripe()
  } catch (e) {
    report.stripeSync.error = e instanceof Error ? e.message : String(e)
  }

  if (!settings.automation_enabled && !force) return report

  report.invites = await guard(() => sendInvites(settings))
  report.reminders = await guard(() => sendBookingReminders(settings))
  report.chases = await guard(() => sendDetailsChases(settings))
  report.plan = await guard(() => sendEventPlan(settings))

  return report
}

async function guard(fn: () => Promise<TaskResult>): Promise<TaskResult> {
  try {
    return await fn()
  } catch (e) {
    return { ...empty(), error: e instanceof Error ? e.message : String(e) }
  }
}

function eventContext(s: Settings) {
  const urls = ticketUrls()
  return {
    single_url: urls.single,
    table_url: urls.table8,
    event_date: formatEventDate(s.event_date),
    venue: s.venue,
    arrival_time: s.arrival_time,
    dress_code: s.dress_code,
  }
}

// ---------------------------------------------------------------------------
// Many people are shortlisted in more than one category. They get ONE email
// naming every category, not one email per nomination.
// ---------------------------------------------------------------------------

type Groupable = {
  id: string
  company_name: string
  contact_name: string | null
  email: string
  category_title: string
}

export function groupByPerson<T extends Groupable>(rows: T[]) {
  const groups = new Map<string, T[]>()
  for (const row of rows) {
    const key = row.email.trim().toLowerCase()
    if (!key) continue
    const list = groups.get(key) ?? []
    list.push(row)
    groups.set(key, list)
  }
  return groups
}

/** "the Business Growth Award" / "the X Award, the Y Award and the Z Award" */
export function categoryPhrase(titles: string[]) {
  const unique = [...new Set(titles.filter(Boolean))].map((t) => `the ${t}`)
  if (unique.length === 0) return 'the Lincolnshire Marketing Awards'
  if (unique.length === 1) return unique[0]
  return `${unique.slice(0, -1).join(', ')} and ${unique[unique.length - 1]}`
}

/** Longest company name wins, since the sheet abbreviates inconsistently. */
function bestCompany(rows: Groupable[]) {
  return rows
    .map((r) => r.company_name)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)[0]
}

// ---------------------------------------------------------------------------
// 1. Congratulations and invite. Only for rows Tom has explicitly armed.
// ---------------------------------------------------------------------------

async function sendInvites(s: Settings): Promise<TaskResult> {
  const out = empty()

  const rows = await sql`
    select id, company_name, contact_name, email, category_title
    from v_shortlist_status
    where is_shortlisted = true and invite_state = 'armed'`

  for (const [email, group] of groupByPerson(rows ?? [])) {
    const titles = group.map((g) => g.category_title)
    const res = await sendTemplate({
      template: 'shortlist_invite',
      to: group[0].email,
      shortlistId: group[0].id,
      // One congratulations email per person, ever, however many categories.
      dedupeKey: `invite:${email}`,
      data: {
        contact_name: firstName(group[0].contact_name) || 'there',
        company_name: bestCompany(group),
        categories: categoryPhrase(titles),
        category_count: titles.length,
        ...eventContext(s),
      },
    })

    if (res.skipped) out.skipped++
    else if (res.ok) out.sent++
    else out.failed++

    if (res.ok) {
      // Mark every one of their nominations invited, not just the first.
      await sql`
        update shortlist
        set invite_state = 'invited', invited_at = ${new Date().toISOString()}
        where id = any(${group.map((g) => g.id)}::uuid[])`
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// 2. Nudge shortlisted people who have not booked.
// ---------------------------------------------------------------------------

async function sendBookingReminders(s: Settings): Promise<TaskResult> {
  const out = empty()
  const left = daysUntil(s.event_date)
  if (left <= 0) return out // event has been and gone

  const schedule = s.invite_reminder_days ?? []

  const rows = await sql`
    select id, company_name, contact_name, email, category_title,
           invite_state, invited_at, reminder_count, has_booked
    from v_shortlist_status
    where is_shortlisted = true and invite_state = 'invited'`

  for (const [email, group] of groupByPerson(rows ?? [])) {
    // If any one of their nominations has a booking against it, they are coming.
    if (group.some((g) => (g as { has_booked: boolean }).has_booked)) continue

    const g0 = group[0] as (typeof group)[0] & {
      invited_at: string | null
      reminder_count: number
    }
    const n = Math.max(
      ...group.map((g) => (g as { reminder_count: number }).reminder_count ?? 0),
    )
    if (n >= schedule.length) continue
    if (!g0.invited_at) continue

    const elapsed = Math.floor((Date.now() - new Date(g0.invited_at).getTime()) / 86_400_000)
    if (elapsed < schedule[n]) continue

    const titles = group.map((g) => g.category_title)
    const res = await sendTemplate({
      template: 'shortlist_reminder',
      to: g0.email,
      shortlistId: g0.id,
      dedupeKey: `reminder:${email}:${n}`,
      data: {
        contact_name: firstName(g0.contact_name) || 'there',
        company_name: bestCompany(group),
        categories: categoryPhrase(titles),
        category_count: titles.length,
        days_left: left,
        ...eventContext(s),
      },
    })

    if (res.skipped) out.skipped++
    else if (res.ok) out.sent++
    else out.failed++

    if (res.ok && !res.skipped) {
      await sql`
        update shortlist
        set reminder_count = ${n + 1}, last_reminder_at = ${new Date().toISOString()}
        where id = any(${group.map((g) => g.id)}::uuid[])`
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// 3. Chase missing guest names and dietaries.
// ---------------------------------------------------------------------------

async function sendDetailsChases(s: Settings): Promise<TaskResult> {
  const out = empty()
  const schedule = s.details_chase_days ?? []

  const orders = await sql`
    select id, buyer_name, buyer_email, seats, created_at, details_chase_count, details_token
    from orders
    where status = 'paid' and details_completed_at is null`

  for (const order of orders ?? []) {
    const n = order.details_chase_count ?? 0
    if (n >= schedule.length) continue

    const elapsed = Math.floor(
      (Date.now() - new Date(order.created_at).getTime()) / 86_400_000,
    )
    if (elapsed < schedule[n]) continue

    const guests = await sql`select full_name from guests where order_id = ${order.id}`
    const named = (guests ?? []).filter((g) => (g.full_name ?? '').trim()).length
    const unnamed = Math.max(order.seats - named, 0)
    if (unnamed === 0) continue

    const res = await sendTemplate({
      template: 'details_chase',
      to: order.buyer_email,
      orderId: order.id,
      dedupeKey: `chase:${order.id}:${n}`,
      data: {
        buyer_name: firstName(order.buyer_name) || 'there',
        seats_unnamed: unnamed,
        booking_url: `${siteUrl()}/booking/${order.details_token}`,
      },
    })

    if (res.skipped) out.skipped++
    else if (res.ok) out.sent++
    else out.failed++

    if (res.ok && !res.skipped) {
      await sql`
        update orders
        set details_chase_count = ${n + 1},
            last_details_chase_at = ${new Date().toISOString()}
        where id = ${order.id}`
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// 4. The plan, sent once, N days out.
// ---------------------------------------------------------------------------

const RUNNING_ORDER = `On the night:
7:00pm  Arrival and drinks reception
7:45pm  Take your seats
8:00pm  Dinner served
9:30pm  Awards presentation
11:00pm Carriages`

async function sendEventPlan(s: Settings): Promise<TaskResult> {
  const out = empty()
  const left = daysUntil(s.event_date)
  if (left !== s.plan_email_days_before) return out

  const orders = await sql`
    select id, buyer_name, buyer_email from orders where status = 'paid'`

  for (const order of orders ?? []) {
    const res = await sendTemplate({
      template: 'event_plan',
      to: order.buyer_email,
      orderId: order.id,
      dedupeKey: `plan:${order.id}`,
      data: {
        guest_first_name: firstName(order.buyer_name) || 'there',
        running_order: RUNNING_ORDER,
        event_date: formatEventDate(s.event_date),
        venue: s.venue,
        arrival_time: s.arrival_time,
        dress_code: s.dress_code,
      },
    })
    if (res.skipped) out.skipped++
    else if (res.ok) out.sent++
    else out.failed++
  }
  return out
}
