import { NextResponse, type NextRequest } from 'next/server'
import { sql } from '@/lib/db'
import { getSettings, formatEventDate } from '@/lib/config'
import { refreshOrderCompletion, firstName } from '@/lib/orders'
import { sendTemplate } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// 30 saves per token per minute. Plenty for a real person filling in 8 seats.
const hits = new Map<string, { n: number; resetAt: number }>()
function rateLimited(token: string) {
  const now = Date.now()
  const rec = hits.get(token)
  if (!rec || now > rec.resetAt) {
    hits.set(token, { n: 1, resetAt: now + 60_000 })
    return false
  }
  rec.n += 1
  return rec.n > 30
}

type SeatInput = {
  seat_number: number
  full_name?: string
  company?: string
  dietary_tags?: string[]
  dietary_notes?: string
  accessibility_notes?: string
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params

  if (!UUID.test(token)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (rateLimited(token)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const orders = await sql`
    select id, seats, buyer_name, buyer_email, details_completed_at, status
    from orders where details_token = ${token}`
  const order = orders[0] ?? null

  if (!order || order.status !== 'paid') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let body: { seats?: SeatInput[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const seats = Array.isArray(body.seats) ? body.seats : []
  if (!seats.length) return NextResponse.json({ error: 'No seats supplied' }, { status: 400 })

  const options = await sql`select slug from dietary_options`
  const validTags = new Set(options.map((o) => o.slug))

  const rows = []
  for (const s of seats) {
    const n = Number(s.seat_number)
    if (!Number.isInteger(n) || n < 1 || n > order.seats) {
      return NextResponse.json({ error: `Invalid seat number ${s.seat_number}` }, { status: 400 })
    }
    let tags = (s.dietary_tags ?? []).filter((t) => validTags.has(t))
    // "No requirements" is exclusive.
    if (tags.includes('none')) tags = ['none']

    rows.push({
      order_id: order.id,
      seat_number: n,
      full_name: clean(s.full_name, 120),
      company: clean(s.company, 160),
      is_buyer: n === 1,
      dietary_tags: tags,
      dietary_notes: clean(s.dietary_notes, 500),
      accessibility_notes: clean(s.accessibility_notes, 500),
      updated_at: new Date().toISOString(),
    })
  }

  try {
    // One statement for all seats, exactly like the previous bulk upsert:
    // conflict target (order_id, seat_number) decides insert versus update.
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
  } catch (error) {
    console.error('[booking] save failed', order.id, error)
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }

  const result = await refreshOrderCompletion(order.id)

  if (result.justCompleted) {
    const settings = await getSettings()
    await sendTemplate({
      template: 'details_complete',
      to: order.buyer_email,
      orderId: order.id,
      dedupeKey: `complete:${order.id}`,
      data: {
        buyer_name: firstName(order.buyer_name) || 'there',
        seats: order.seats,
        event_date: formatEventDate(settings.event_date),
        venue: settings.venue,
        arrival_time: settings.arrival_time,
        dress_code: settings.dress_code,
      },
    })
  }

  return NextResponse.json({
    ok: true,
    complete: result.completed,
    unnamed: result.unnamed ?? 0,
  })
}

function clean(v: string | undefined, max: number) {
  if (typeof v !== 'string') return null
  const t = v.trim().slice(0, max)
  return t.length ? t : null
}
