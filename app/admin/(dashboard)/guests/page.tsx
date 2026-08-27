import { db } from '@/lib/supabase'
import GuestTable from './guest-table'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GuestsPage() {
  const supabase = db()

  const [{ data: orders }, { data: options }] = await Promise.all([
    supabase
      .from('orders')
      .select(
        'id, buyer_name, buyer_email, buyer_company, seats, ticket_type, status, details_completed_at, created_at, guests(id, seat_number, full_name, company, dietary_tags, dietary_notes, accessibility_notes)',
      )
      .order('created_at', { ascending: false }),
    supabase.from('dietary_options').select('slug, label').eq('active', true).order('sort_order'),
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
