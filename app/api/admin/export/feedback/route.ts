import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Feedback export, admin-only (enforced by the middleware on /api/admin).
 * Anonymity carries through: anonymous rows have null identity columns in
 * the database by check constraint, and this export blanks them again
 * belt-and-braces before writing the file.
 */
export async function GET() {
  const rows = await sql`
    select created_at, year,
           rating_overall, rating_venue, rating_food, rating_entertainment, rating_ceremony,
           length_felt, price_felt, would_return, would_enter,
           best_part, would_change, category_ideas, anything_else,
           is_anonymous, name, business, email
    from feedback
    order by created_at desc`

  const header = [
    'Submitted',
    'Year',
    'Overall',
    'Venue',
    'Food',
    'Entertainment',
    'Ceremony',
    'Length felt',
    'Price felt',
    'Would return',
    'Would enter',
    'Best part',
    'Would change',
    'Category ideas',
    'Anything else',
    'Anonymous',
    'Name',
    'Business',
    'Email',
  ]

  const lines = [header.map(csv).join(',')]
  for (const r of rows) {
    const anonymous = Boolean(r.is_anonymous)
    lines.push(
      [
        new Date(r.created_at).toISOString(),
        String(r.year ?? ''),
        num(r.rating_overall),
        num(r.rating_venue),
        num(r.rating_food),
        num(r.rating_entertainment),
        num(r.rating_ceremony),
        r.length_felt ?? '',
        r.price_felt ?? '',
        r.would_return ?? '',
        r.would_enter ?? '',
        r.best_part ?? '',
        r.would_change ?? '',
        r.category_ideas ?? '',
        r.anything_else ?? '',
        anonymous ? 'yes' : 'no',
        anonymous ? '' : r.name ?? '',
        anonymous ? '' : r.business ?? '',
        anonymous ? '' : r.email ?? '',
      ]
        .map(csv)
        .join(','),
    )
  }

  const stamp = new Date().toISOString().slice(0, 10)
  return new NextResponse(`﻿${lines.join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="awards-feedback-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}

function num(v: unknown) {
  return v === null || v === undefined ? '' : String(v)
}

function csv(v: string) {
  const s = v ?? ''
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
