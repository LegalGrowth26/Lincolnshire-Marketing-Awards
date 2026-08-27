import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The file that goes to the venue.
 * Names and dietary needs only. No category, no score, no result. This is
 * deliberate, do not add columns without checking docs/CONFIDENTIAL.md.
 */
export async function GET() {
  const supabase = db()

  const { data } = await supabase
    .from('guests')
    .select(
      'seat_number, full_name, company, dietary_tags, dietary_notes, accessibility_notes, orders!inner(buyer_name, buyer_company, status, ticket_type)',
    )
    .order('order_id')
    .order('seat_number')

  const rows = (data ?? []).filter(
    (g) => (g.orders as unknown as { status: string }).status === 'paid',
  )

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
    const o = g.orders as unknown as { buyer_name: string; buyer_company: string }
    lines.push(
      [
        o.buyer_company || o.buyer_name || '',
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
