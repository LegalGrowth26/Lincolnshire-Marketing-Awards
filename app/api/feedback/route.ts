import { NextResponse, type NextRequest } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * ANONYMITY CONTRACT — read before touching this file.
 *
 * The feedback page promises: "If you leave this switched off we do not
 * record who you are, and we have no way of working it out afterwards."
 * This handler keeps that promise by construction:
 *
 *  - It reads ONLY the JSON body. No IP address, no user agent, no cookies,
 *    no headers — nothing about the request is read, stored or logged.
 *  - On an anonymous submission the identifying fields are never even read
 *    from the body; the row is inserted with name/business/email null.
 *  - The database's feedback_anonymous_is_anonymous check rejects any
 *    anonymous row carrying identifying data. Do not work around it.
 *  - Spam control is a honeypot field and an elapsed-time check, both
 *    carried in the body. Nothing fingerprints the visitor.
 *  - Do not add logging of the request or its body to this file.
 */

const CHOICES = {
  length_felt: ['too_short', 'about_right', 'too_long'],
  price_felt: ['too_cheap', 'about_right', 'too_expensive'],
  would_return: ['yes', 'maybe', 'no'],
  would_enter: ['yes', 'maybe', 'no', 'did_not_enter'],
} as const

function rating(v: unknown): number | null {
  const n = Number(v)
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null
}

function choice(v: unknown, allowed: readonly string[]): string | null {
  return typeof v === 'string' && allowed.includes(v) ? v : null
}

function text(v: unknown, max = 4000): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim().slice(0, max)
  return t.length ? t : null
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  // Spam guards. Both respond as if accepted, storing nothing.
  const honeypot = typeof body.website === 'string' && body.website.trim().length > 0
  const elapsed = Number(body.elapsed)
  const tooFast = !Number.isFinite(elapsed) || elapsed < 3000
  if (honeypot || tooFast) {
    return NextResponse.json({ ok: true })
  }

  // Anonymous is the default state. Only an explicit false counts as
  // identified, and only then are the identifying fields read at all.
  const isAnonymous = body.is_anonymous !== false
  const name = isAnonymous ? null : text(body.name, 120)
  const business = isAnonymous ? null : text(body.business, 160)
  const email = isAnonymous ? null : text(body.email, 200)

  try {
    await sql`
      insert into feedback (
        rating_overall, rating_venue, rating_food, rating_entertainment, rating_ceremony,
        length_felt, price_felt, would_return, would_enter,
        best_part, would_change, category_ideas, anything_else,
        is_anonymous, name, business, email
      ) values (
        ${rating(body.rating_overall)}, ${rating(body.rating_venue)},
        ${rating(body.rating_food)}, ${rating(body.rating_entertainment)},
        ${rating(body.rating_ceremony)},
        ${choice(body.length_felt, CHOICES.length_felt)},
        ${choice(body.price_felt, CHOICES.price_felt)},
        ${choice(body.would_return, CHOICES.would_return)},
        ${choice(body.would_enter, CHOICES.would_enter)},
        ${text(body.best_part)}, ${text(body.would_change)},
        ${text(body.category_ideas)}, ${text(body.anything_else)},
        ${isAnonymous}, ${name}, ${business}, ${email}
      )`
  } catch {
    // Deliberately no logging: nothing about this request may be recorded.
    return NextResponse.json({ error: 'Could not save your feedback' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
