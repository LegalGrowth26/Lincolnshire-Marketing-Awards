import { sql } from '@/lib/db'
import GuestTable from './guest-table'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GuestsPage() {
  const [orders, options] = await Promise.all([
    sql`
      select o.id, o.buyer_name, o.buyer_email, o.buyer_company, o.seats,
             o.ticket_type, o.status, o.details_completed_at, o.created_at,
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
      order by o.created_at desc`,
    sql`select slug, label from dietary_options where active = true order by sort_order`,
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Guest list</h1>
        <p className="text-neutral-500 mt-2">
          Every seat sold. Edit anything here if someone calls or emails a change.
        </p>
      </div>
      <GuestTable orders={orders ?? []} options={options ?? []} />
    </div>
  )
}
