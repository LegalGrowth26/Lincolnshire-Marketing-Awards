import Link from 'next/link'
import { sql } from '@/lib/db'
import GuestTable from './guest-table'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// This page answers one question: who is coming, on whose booking, and what
// do they eat. Paid bookings only — pending and cancelled live on the
// dashboard chase lists. It never queries shortlist_results, and must not:
// see docs/CONFIDENTIAL.md.

export default async function GuestsPage() {
  const [orders, options, pendingCount] = await Promise.all([
    sql`
      select o.id, o.buyer_name, o.buyer_email, o.buyer_company, o.seats,
             o.ticket_type, o.status, o.details_completed_at, o.created_at,
             (coalesce(o.amount_total, 0) = 0 and o.stripe_session_id is null) as is_comped,
             coalesce(
               (select json_agg(json_build_object(
                  'id', g.id,
                  'seat_number', g.seat_number,
                  'full_name', g.full_name,
                  'company', g.company,
                  'dietary_tags', g.dietary_tags,
                  'dietary_notes', g.dietary_notes,
                  'accessibility_notes', g.accessibility_notes
                ) order by g.seat_number)
                from guests g where g.order_id = o.id),
               '[]'::json
             ) as guests
      from orders o
      where o.status = 'paid'
      order by o.created_at desc`,
    sql`select slug, label from dietary_options where active = true order by sort_order`,
    sql`select count(*)::int as n from orders where status = 'pending'`,
  ])

  // Dietary totals, built live from exactly the guests shown below.
  const allGuests = orders.flatMap((o) => o.guests as { dietary_tags: string[] | null }[])
  const tagCounts = new Map<string, number>()
  let noRequirement = 0
  for (const g of allGuests) {
    const tags = (g.dietary_tags ?? []).filter((t) => t !== 'none')
    if (tags.length === 0) noRequirement++
    for (const t of tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
  }
  const summary = options
    .filter((o) => o.slug !== 'none' && (tagCounts.get(o.slug) ?? 0) > 0)
    .map((o) => ({ label: o.label, count: tagCounts.get(o.slug) ?? 0 }))

  const pending = Number(pendingCount[0]?.n ?? 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Guest list</h1>
          <p className="text-neutral-500 mt-2">
            Every paid booking and who is sitting on it. Click a seat to edit anything
            when someone calls or emails a change.
          </p>
        </div>
        <a
          href="/api/admin/export/venue"
          className="text-sm font-semibold border border-neutral-300 rounded-md px-4 py-2 hover:bg-neutral-50"
        >
          Download venue CSV
        </a>
      </div>

      {/* Dietary totals, from live data */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <p className="text-sm font-semibold mb-3">Dietary requirements across all seats</p>
        <div className="flex flex-wrap items-center gap-2">
          {summary.map(({ label, count }) => (
            <span
              key={label}
              className="text-sm font-semibold bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full"
            >
              {count} {label.toLowerCase()}
            </span>
          ))}
          <span className="text-sm text-neutral-500 px-1">
            {noRequirement} no requirement
          </span>
        </div>
      </div>

      <GuestTable orders={orders} options={options} />

      {pending > 0 && (
        <p className="text-sm text-neutral-400">
          {pending} {pending === 1 ? 'booking is' : 'bookings are'} awaiting payment and not
          shown here —{' '}
          <Link href="/admin" className="underline underline-offset-4 hover:text-neutral-600">
            see the dashboard
          </Link>
          .
        </p>
      )}
    </div>
  )
}
