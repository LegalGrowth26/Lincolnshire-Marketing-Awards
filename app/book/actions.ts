'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { ticketUrls } from '@/lib/config'
import type { TicketType } from '@/lib/orders'

export type BookSeatInput = {
  seat_number: number
  full_name?: string
  company?: string
  dietary_tags?: string[]
  dietary_notes?: string
  accessibility_notes?: string
}

export type BookInput = {
  ticket_type: TicketType
  buyer_name: string
  buyer_company?: string
  buyer_email: string
  buyer_phone?: string
  seats: BookSeatInput[]
}

// Light in-memory throttle, same shape as the login and booking-save guards.
const hits = new Map<string, { n: number; resetAt: number }>()
function throttled(ip: string) {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { n: 1, resetAt: now + 60_000 })
    return false
  }
  rec.n += 1
  return rec.n > 10
}

function clean(v: string | undefined, max: number) {
  if (typeof v !== 'string') return null
  const t = v.trim().slice(0, max)
  return t.length ? t : null
}

/**
 * Details-first checkout. Creates the order as 'pending' (the insert trigger
 * creates its seat rows), saves whatever guest details were supplied, stamps
 * checkout_started_at, then sends the browser to the Stripe payment link with
 * client_reference_id=<order.id> so the payment can be matched back.
 *
 * The order's details_token never goes anywhere near a URL parameter — it is
 * the secret that guards the guest form, and the buyer only receives it after
 * payment, via the redirect and the confirmation email.
 */
export async function startBooking(input: BookInput): Promise<{ error: string }> {
  const hdrs = await headers()
  const ip = (hdrs.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  if (throttled(ip)) {
    return { error: 'Too many attempts. Give it a minute, then try again.' }
  }

  const ticketType: TicketType | null =
    input.ticket_type === 'table8' ? 'table8' : input.ticket_type === 'single' ? 'single' : null
  if (!ticketType) return { error: 'Choose a ticket type.' }
  const seatsTotal = ticketType === 'table8' ? 8 : 1

  // Only the buyer's name and email are required. Guest names are optional
  // here on purpose — table buyers often do not know all eight names yet, and
  // the booking link collects the rest after payment.
  const buyerName = clean(input.buyer_name, 120)
  const buyerEmail = (input.buyer_email ?? '').trim().toLowerCase()
  if (!buyerName) return { error: 'Please add your name.' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(buyerEmail)) {
    return { error: 'Please add a valid email address.' }
  }
  const buyerCompany = clean(input.buyer_company, 160)
  const buyerPhone = clean(input.buyer_phone, 40)

  let orderId: string
  try {
    const inserted = await sql`
      insert into orders (ticket_type, seats, buyer_name, buyer_company, buyer_email,
                          buyer_phone, status, checkout_started_at)
      values (${ticketType}, ${seatsTotal}, ${buyerName}, ${buyerCompany}, ${buyerEmail},
              ${buyerPhone}, 'pending', ${new Date().toISOString()})
      returning id`
    orderId = inserted[0].id
  } catch (e) {
    console.error('[book] could not create pending order', e)
    return {
      error:
        'Something went wrong starting your booking. Please try again, or email tom@lincolnshiremarketing.co.uk.',
    }
  }

  // Guest details must never block payment: save what was supplied, and if
  // this fails the booking link collects them again after payment.
  try {
    const options = await sql`select slug from dietary_options`
    const validTags = new Set(options.map((o) => o.slug))

    const rows = []
    for (const s of Array.isArray(input.seats) ? input.seats : []) {
      const n = Number(s.seat_number)
      if (!Number.isInteger(n) || n < 1 || n > seatsTotal) continue
      let tags = (s.dietary_tags ?? []).filter((t) => validTags.has(t))
      if (tags.includes('none')) tags = ['none']
      const row = {
        order_id: orderId,
        seat_number: n,
        full_name: clean(s.full_name, 120),
        company: clean(s.company, 160),
        is_buyer: n === 1,
        dietary_tags: tags,
        dietary_notes: clean(s.dietary_notes, 500),
        accessibility_notes: clean(s.accessibility_notes, 500),
        updated_at: new Date().toISOString(),
      }
      const hasContent =
        row.full_name || row.company || tags.length || row.dietary_notes || row.accessibility_notes
      if (hasContent) rows.push(row)
    }

    if (rows.length) {
      await sql`
        insert into guests (order_id, seat_number, full_name, company, is_buyer,
                            dietary_tags, dietary_notes, accessibility_notes, updated_at)
        select (g->>'order_id')::uuid,
               (g->>'seat_number')::int,
               g->>'full_name',
               g->>'company',
               (g->>'is_buyer')::boolean,
               array(select jsonb_array_elements_text(g->'dietary_tags')),
               g->>'dietary_notes',
               g->>'accessibility_notes',
               (g->>'updated_at')::timestamptz
        from jsonb_array_elements(${JSON.stringify(rows)}::jsonb) as g
        on conflict (order_id, seat_number) do update set
          full_name = excluded.full_name,
          company = excluded.company,
          is_buyer = excluded.is_buyer,
          dietary_tags = excluded.dietary_tags,
          dietary_notes = excluded.dietary_notes,
          accessibility_notes = excluded.accessibility_notes,
          updated_at = excluded.updated_at`
    }
  } catch (e) {
    console.error('[book] could not save guest details', orderId, e)
  }

  const url = new URL(ticketType === 'table8' ? ticketUrls().table8 : ticketUrls().single)
  url.searchParams.set('client_reference_id', orderId)
  url.searchParams.set('prefilled_email', buyerEmail)
  redirect(url.toString())
}
