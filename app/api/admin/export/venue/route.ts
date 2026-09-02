import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The file that goes to the venue: every attending person (paid bookings,
 * comped included) with name, company, dietary requirement, access notes and
 * the booking they sit on. Nothing else — no category, no score, no result,
 * no email addresses. This is deliberate, do not add columns without checking
 * docs/CONFIDENTIAL.md.
 */
export async function GET() {
  const data = await sql`
    select g.full_name, g.company, g.dietary_tags, g.dietary_notes,
           g.accessibility_notes, o.buyer_name, o.buyer_company, o.status
    from guests g
    inner join orders o on o.id = g.order_id
    order by g.order_id, g.seat_number`

  const rows = data.filter((g) => g.status === 'paid')

  const header = ['Booking', 'Guest name', 'Company', 'Dietary requirement', 'Access notes']

  const lines = [header.map(csv).join(',')]
  for (const g of rows) {
    const dietary = [(g.dietary_tags ?? []).filter((t: string) => t !== 'none').join('; '),
      g.dietary_notes || '']
      .filter(Boolean)
      .join(' | ')
    lines.push(
      [
        g.buyer_company || g.buyer_name || '',
        g.full_name || 'Not yet named',
        g.company || '',
        dietary,
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
