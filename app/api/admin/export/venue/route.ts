import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The file that goes to the venue.
 * Names and dietary needs only. No category, no score, no result. This is
 * deliberate, do not add columns without checking docs/CONFIDENTIAL.md.
 */
export async function GET() {
  const data = await sql`
    select g.seat_number, g.full_name, g.company, g.dietary_tags, g.dietary_notes,
           g.accessibility_notes, o.buyer_name, o.buyer_company, o.status
    from guests g
    inner join orders o on o.id = g.order_id
    order by g.order_id, g.seat_number`

  const rows = data.filter((g) => g.status === 'paid')

  const header = [
    'Table or booking',
    'Seat',
    'Guest name',
    'Company',
    'Dietary requirements',
    'Dietary notes',
    'Access notes',
  ]

  const lines = [header.map(csv).join(',')]
  for (const g of rows) {
    lines.push(
      [
        g.buyer_company || g.buyer_name || '',
        String(g.seat_number),
        g.full_name || '',
        g.company || '',
        (g.dietary_tags ?? []).join('; '),
        g.dietary_notes || '',
        g.accessibility_notes || '',
      ]
        .map(csv)
        .join(','),
    )
  }

  const stamp = new Date().toISOString().slice(0, 10)
  return new NextResponse(`﻿${lines.join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="awards-guest-list-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}

function csv(v: string) {
  const s = v ?? ''
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
