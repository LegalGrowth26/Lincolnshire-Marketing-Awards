import 'server-only'
import Stripe from 'stripe'
import { sql } from './db'
import { getSettings, siteUrl, formatEventDate, poundsFromPence } from './config'
import { createHash } from 'node:crypto'
import { sendTemplate, internalRecipients } from './email'

let stripeClient: Stripe | null = null
export function stripe(): Stripe {
  if (stripeClient) return stripeClient
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY')
  stripeClient = new Stripe(key)
  return stripeClient
}

export type TicketType = 'single' | 'table8'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const ticketLabel = (t: TicketType) =>
  t === 'table8' ? 'Table of 8' : 'Single ticket'

/**
 * The two payment links behind the ticket cards. The tickets are payment
 * links, not catalogue products, so the plink_ id is the reliable handle for
 * deciding whether a Stripe session is ours — never the price id.
 */
function paymentLinks() {
  return {
    single: process.env.STRIPE_LINK_SINGLE || null,
    table8: process.env.STRIPE_LINK_TABLE8 || null,
  }
}

/**
 * Which of our ticket links a session was paid through, or null when the
 * session is not ours (a different link, or no link at all). Null means skip:
 * there is deliberately no amount fallback and no unmapped default.
 */
export function ticketTypeForSession(session: Stripe.Checkout.Session): TicketType | null {
  const link =
    typeof session.payment_link === 'string'
      ? session.payment_link
      : session.payment_link?.id ?? null
  if (!link) return null
  const links = paymentLinks()
  if (links.table8 && link === links.table8) return 'table8'
  if (links.single && link === links.single) return 'single'
  return null
}

/** Total quantity across the session's line items — two tables on one payment is quantity 2. */
async function sessionQuantity(session: Stripe.Checkout.Session): Promise<number> {
  let items = session.line_items?.data
  if (!items) {
    const full = await stripe().checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    })
    items = full.line_items?.data
  }
  const qty = (items ?? []).reduce((n, item) => n + (item.quantity ?? 1), 0)
  return Math.max(qty, 1)
}

/**
 * Details-first flow: the order already exists as 'pending' and the Stripe
 * session carries its id in client_reference_id. Mark it paid and send the
 * confirmation emails (deduped on order id). Idempotent — a repeat call finds
 * the order already paid and the emails already claimed. Returns null when
 * the session carries no usable reference or it matches no pending or paid
 * order, so the caller can fall back to creating the order from the session.
 */
export async function markOrderPaidFromSession(session: Stripe.Checkout.Session) {
  const orderId = session.client_reference_id
  if (!orderId || !UUID.test(orderId)) return null

  const updated = await sql`
    update orders set
      status = 'paid',
      paid_at = ${new Date().toISOString()},
      stripe_session_id = ${session.id},
      stripe_payment_intent =
        ${typeof session.payment_intent === 'string' ? session.payment_intent : null},
      amount_total = ${session.amount_total ?? null},
      buyer_name = coalesce(nullif(buyer_name, ''), ${session.customer_details?.name ?? null}),
      buyer_phone = coalesce(nullif(buyer_phone, ''), ${session.customer_details?.phone ?? null})
    where id = ${orderId} and status = 'pending'
    returning id, details_token, buyer_email, seats, ticket_type`

  let order = updated[0] ?? null
  if (!order) {
    const existing = await sql`
      select id, details_token, buyer_email, seats, ticket_type, status
      from orders where id = ${orderId}`
    if (!existing[0] || existing[0].status !== 'paid') return null
    // Already marked by the webhook, the return redirect, or the sync — the
    // emails below are deduped on order id, so re-running them is safe.
    order = existing[0]
  }

  await sendOrderEmails(order.id)
  return { order, created: false }
}

/**
 * Single entry point for a paid checkout session from any source (webhook,
 * return redirect, daily sync). A session carrying a client_reference_id that
 * matches one of our orders is always ours, whatever link it was paid
 * through. Otherwise the session is only processed when it was paid through
 * one of our two payment links; anything else is skipped silently (returns
 * null).
 */
export async function recordPaidSession(session: Stripe.Checkout.Session) {
  const marked = await markOrderPaidFromSession(session)
  if (marked) return marked

  const ticketType = ticketTypeForSession(session)
  if (!ticketType) return null

  return upsertOrderFromSession(session, ticketType)
}

export type StripeSyncResult = {
  checked: number
  markedPaid: number
  created: number
  error?: string
}

/**
 * Reconcile Stripe against the orders table: paid Checkout Sessions from the
 * last 90 days, newest first. Sessions already recorded are skipped by
 * stripe_session_id. A client_reference_id matching one of our orders marks
 * it paid; otherwise only sessions paid through our two payment links are
 * created, and everything else is skipped silently. Refuses to run at all
 * when either link env var is missing — it must never import everything.
 * Idempotent, so it is safe on the daily cron and the dashboard button.
 */
export async function syncFromStripe(): Promise<StripeSyncResult> {
  const links = paymentLinks()
  if (!links.single || !links.table8) {
    return {
      checked: 0,
      markedPaid: 0,
      created: 0,
      error:
        'STRIPE_LINK_SINGLE and STRIPE_LINK_TABLE8 must both be set. Refusing to import anything until they are.',
    }
  }

  const out: StripeSyncResult = { checked: 0, markedPaid: 0, created: 0 }
  const since = Math.floor(Date.now() / 1000) - 90 * 86_400
  let startingAfter: string | undefined

  for (let page = 0; page < 5; page++) {
    const batch = await stripe().checkout.sessions.list({
      limit: 100,
      created: { gte: since },
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    })

    for (const session of batch.data) {
      if (session.payment_status !== 'paid') continue
      out.checked++

      const seen = await sql`select id from orders where stripe_session_id = ${session.id}`
      if (seen[0]) continue

      const recorded = await recordPaidSession(session)
      if (!recorded) continue // not ours — skip silently
      if (recorded.created) out.created++
      else out.markedPaid++
    }

    if (!batch.has_more || batch.data.length === 0) break
    startingAfter = batch.data[batch.data.length - 1].id
  }
  return out
}

/**
 * Create an order from a session paid through one of our payment links.
 * Idempotent. Safe to call from the webhook and the return redirect for the
 * same session: the unique constraint on stripe_session_id decides the winner.
 */
export async function upsertOrderFromSession(
  session: Stripe.Checkout.Session,
  ticketType: TicketType,
) {
  const existing = await sql`
    select id, details_token, buyer_email, seats, ticket_type
    from orders where stripe_session_id = ${session.id}`
  if (existing[0]) return { order: existing[0], created: false }

  const quantity = await sessionQuantity(session)
  const seats = (ticketType === 'table8' ? 8 : 1) * quantity

  const email = session.customer_details?.email ?? session.customer_email ?? ''
  if (!email) throw new Error(`No buyer email on session ${session.id}`)

  // Link to the shortlist only when the email matches exactly one row.
  let shortlistId: string | null = null
  const match = await sql`
    select id from shortlist where lower(email) = lower(${email}) limit 2`
  if (match.length === 1) shortlistId = match[0].id

  let order
  try {
    const inserted = await sql`
      insert into orders (
        stripe_session_id, stripe_payment_intent, ticket_type,
        seats, amount_total, currency, buyer_name, buyer_email, buyer_phone,
        shortlist_id, status
      ) values (
        ${session.id},
        ${typeof session.payment_intent === 'string' ? session.payment_intent : null},
        ${ticketType}, ${seats}, ${session.amount_total ?? 0},
        ${session.currency ?? 'gbp'}, ${session.customer_details?.name ?? null},
        ${email.toLowerCase()}, ${session.customer_details?.phone ?? null},
        ${shortlistId}, 'paid'
      )
      returning id, details_token, buyer_email, seats, ticket_type, buyer_name, amount_total`
    order = inserted[0]
  } catch (insertError) {
    // Lost a race with a concurrent insert on the stripe_session_id unique
    // constraint. Read the winner and carry on.
    const again = await sql`
      select id, details_token, buyer_email, seats, ticket_type
      from orders where stripe_session_id = ${session.id}`
    if (again[0]) return { order: again[0], created: false }
    throw insertError
  }

  await sendOrderEmails(order.id)
  return { order, created: true }
}

type GuestRow = {
  seat_number: number
  full_name: string | null
  company: string | null
  dietary_tags: string[] | null
  dietary_notes: string | null
  accessibility_notes?: string | null
}

/** One line per seat for the internal alerts. Unnamed seats say so plainly. */
export function formatGuestLines(guests: GuestRow[]): string {
  if (!guests.length) return 'No seats registered yet.'
  return guests
    .map((g) => {
      const name = (g.full_name ?? '').trim()
      if (!name) return `Seat ${g.seat_number}: not yet named`
      const company = (g.company ?? '').trim()
      const extras = [(g.dietary_tags ?? []).join(', '), (g.dietary_notes ?? '').trim()]
        .filter(Boolean)
        .join(' | ')
      return (
        `Seat ${g.seat_number}: ${name}` +
        (company ? ` (${company})` : '') +
        (extras ? ` — ${extras}` : '')
      )
    })
    .join('\n')
}

/** Buyer confirmation plus the internal sale alert. Both deduped on order id. */
export async function sendOrderEmails(orderId: string) {
  const settings = await getSettings()

  const orders = await sql`
    select id, buyer_name, buyer_company, buyer_email, buyer_phone,
           seats, ticket_type, amount_total, details_token
    from orders where id = ${orderId}`
  const order = orders[0]
  if (!order) return

  const guests: GuestRow[] = await sql`
    select seat_number, full_name, company, dietary_tags, dietary_notes
    from guests where order_id = ${orderId} order by seat_number`

  let summary: { seats_sold: number } | null = null
  try {
    const rows = await sql`select seats_sold from v_seat_summary`
    summary = rows[0] ?? null
  } catch {
    summary = null // fall back below; the sale alert must still go out
  }

  const label = ticketLabel(order.ticket_type as TicketType)
  const bookingUrl = `${siteUrl()}/booking/${order.details_token}`
  const eventDate = formatEventDate(settings.event_date)

  await sendTemplate({
    template: 'ticket_confirmation',
    to: order.buyer_email,
    orderId: order.id,
    dedupeKey: `confirmation:${order.id}`,
    data: {
      buyer_name: firstName(order.buyer_name) || 'there',
      seats: order.seats,
      ticket_type_label: label,
      booking_url: bookingUrl,
      event_date: eventDate,
      venue: settings.venue,
      arrival_time: settings.arrival_time,
      dress_code: settings.dress_code,
    },
  })

  await sendTemplate({
    template: 'internal_sale_alert',
    to: internalRecipients(),
    orderId: order.id,
    dedupeKey: `sale:${order.id}`,
    data: {
      buyer_name: order.buyer_name || 'Unknown',
      buyer_company: order.buyer_company || '—',
      buyer_email: order.buyer_email,
      buyer_phone: order.buyer_phone || '—',
      ticket_type_label: label,
      seats: order.seats,
      amount: poundsFromPence(Number(order.amount_total ?? 0)),
      seats_sold_total: Number(summary?.seats_sold ?? order.seats),
      guest_list: formatGuestLines(guests),
    },
  })
}

/**
 * Internal alert when a buyer changes or completes guest details after their
 * booking was already paid. Deduped on the order id plus a hash of the guest
 * details, so an unchanged save sends nothing and a real change sends once.
 */
export async function sendDetailsUpdatedAlert(orderId: string) {
  const orders = await sql`
    select id, buyer_name, buyer_company, buyer_email, seats, ticket_type
    from orders where id = ${orderId} and status = 'paid'`
  const order = orders[0]
  if (!order) return

  const guests: GuestRow[] = await sql`
    select seat_number, full_name, company, dietary_tags, dietary_notes, accessibility_notes
    from guests where order_id = ${orderId} order by seat_number`

  const digest = createHash('sha256')
    .update(
      JSON.stringify(
        guests.map((g) => [
          g.seat_number,
          (g.full_name ?? '').trim(),
          (g.company ?? '').trim(),
          [...(g.dietary_tags ?? [])].sort(),
          (g.dietary_notes ?? '').trim(),
          (g.accessibility_notes ?? '').trim(),
        ]),
      ),
    )
    .digest('hex')
    .slice(0, 16)

  const named = guests.filter((g) => (g.full_name ?? '').trim().length > 0).length

  await sendTemplate({
    template: 'internal_details_updated',
    to: internalRecipients(),
    orderId: order.id,
    dedupeKey: `details:${order.id}:${digest}`,
    data: {
      buyer_name: order.buyer_name || order.buyer_email,
      buyer_company: order.buyer_company || '—',
      buyer_email: order.buyer_email,
      ticket_type_label: ticketLabel(order.ticket_type as TicketType),
      seats: Number(order.seats),
      seats_named: named,
      guest_list: formatGuestLines(guests),
    },
  })
}

export function firstName(name: string | null | undefined) {
  if (!name) return ''
  return name.trim().split(/\s+/)[0]
}

/**
 * Recalculate whether every seat on an order has a name, and flip
 * details_completed_at accordingly. Returns true if it just completed.
 */
export async function refreshOrderCompletion(orderId: string) {
  const orders = await sql`
    select id, seats, details_completed_at, buyer_name, buyer_email
    from orders where id = ${orderId}`
  const order = orders[0]
  if (!order) return { completed: false, justCompleted: false }

  const guests = await sql`select full_name from guests where order_id = ${orderId}`

  const named = guests.filter((g) => (g.full_name ?? '').trim().length > 0).length
  const complete = named >= order.seats

  if (complete && !order.details_completed_at) {
    await sql`
      update orders set details_completed_at = ${new Date().toISOString()}
      where id = ${orderId}`
    return { completed: true, justCompleted: true, unnamed: 0 }
  }
  if (!complete && order.details_completed_at) {
    await sql`update orders set details_completed_at = null where id = ${orderId}`
  }
  return { completed: complete, justCompleted: false, unnamed: order.seats - named }
}
