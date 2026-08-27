import 'server-only'
import Stripe from 'stripe'
import { sql } from './db'
import { getSettings, siteUrl, formatEventDate, poundsFromPence } from './config'
import { sendTemplate, internalRecipient } from './email'

let stripeClient: Stripe | null = null
export function stripe(): Stripe {
  if (stripeClient) return stripeClient
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY')
  stripeClient = new Stripe(key)
  return stripeClient
}

export type TicketType = 'single' | 'table8'

export const ticketLabel = (t: TicketType) =>
  t === 'table8' ? 'Table of 8' : 'Single ticket'

/**
 * Work out how many seats a paid session represents.
 * Quantity matters: someone can buy two tables on one link.
 */
export async function resolveSeats(
  session: Stripe.Checkout.Session,
): Promise<{ ticketType: TicketType; seats: number; priceId: string | null; mapped: boolean }> {
  const single = process.env.STRIPE_PRICE_SINGLE
  const table8 = process.env.STRIPE_PRICE_TABLE8

  let items = session.line_items?.data
  if (!items) {
    const full = await stripe().checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    })
    items = full.line_items?.data
  }

  let seats = 0
  let sawTable = false
  let sawSingle = false
  let priceId: string | null = null

  for (const item of items ?? []) {
    const id = item.price?.id ?? null
    const qty = item.quantity ?? 1
    if (id && table8 && id === table8) {
      seats += 8 * qty
      sawTable = true
      priceId = priceId ?? id
    } else if (id && single && id === single) {
      seats += qty
      sawSingle = true
      priceId = priceId ?? id
    }
  }

  if (seats > 0) {
    return {
      ticketType: sawTable && !sawSingle ? 'table8' : sawTable ? 'table8' : 'single',
      seats,
      priceId,
      mapped: true,
    }
  }

  // Unmapped. Record it as a single seat rather than losing the sale, and alert.
  return { ticketType: 'single', seats: 1, priceId, mapped: false }
}

/**
 * Idempotent. Safe to call from the webhook and the return redirect for the
 * same session: the unique constraint on stripe_session_id decides the winner.
 */
export async function upsertOrderFromSession(session: Stripe.Checkout.Session) {
  const existing = await sql`
    select id, details_token, buyer_email, seats, ticket_type
    from orders where stripe_session_id = ${session.id}`
  if (existing[0]) return { order: existing[0], created: false }

  const { ticketType, seats, priceId, mapped } = await resolveSeats(session)

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
        stripe_session_id, stripe_payment_intent, stripe_price_id, ticket_type,
        seats, amount_total, currency, buyer_name, buyer_email, buyer_phone,
        shortlist_id, status
      ) values (
        ${session.id},
        ${typeof session.payment_intent === 'string' ? session.payment_intent : null},
        ${priceId}, ${ticketType}, ${seats}, ${session.amount_total ?? 0},
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

  if (!mapped) {
    await sendTemplate({
      template: 'internal_unmapped_order',
      to: internalRecipient(),
      data: {
        stripe_session_id: session.id,
        amount: poundsFromPence(session.amount_total ?? 0),
      },
      dedupeKey: `unmapped:${session.id}`,
      orderId: order.id,
    })
  }

  await sendOrderEmails(order.id)
  return { order, created: true }
}

/** Buyer confirmation plus the internal sale alert. Both deduped on order id. */
export async function sendOrderEmails(orderId: string) {
  const settings = await getSettings()

  const orders = await sql`
    select id, buyer_name, buyer_email, seats, ticket_type, amount_total, details_token
    from orders where id = ${orderId}`
  const order = orders[0]
  if (!order) return

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
    to: internalRecipient(),
    orderId: order.id,
    dedupeKey: `sale:${order.id}`,
    data: {
      buyer_name: order.buyer_name || 'Unknown',
      buyer_email: order.buyer_email,
      ticket_type_label: label,
      seats: order.seats,
      amount: poundsFromPence(order.amount_total),
      seats_sold_total: summary?.seats_sold ?? order.seats,
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
