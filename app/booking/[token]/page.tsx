import { notFound } from 'next/navigation'
import { db } from '@/lib/supabase'
import { getSettings, formatEventDate } from '@/lib/config'
import { ticketLabel, type TicketType } from '@/lib/orders'
import BookingForm from './booking-form'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Your guest details', robots: { index: false } }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function BookingPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  if (!UUID.test(token)) notFound()

  const supabase = db()

  const { data: order } = await supabase
    .from('orders')
    .select('id, seats, ticket_type, buyer_name, buyer_company, status, details_completed_at')
    .eq('details_token', token)
    .maybeSingle()

  if (!order || order.status !== 'paid') notFound()

  const [{ data: guests }, { data: options }, settings] = await Promise.all([
    supabase
      .from('guests')
      .select('seat_number, full_name, company, dietary_tags, dietary_notes, accessibility_notes')
      .eq('order_id', order.id)
      .order('seat_number'),
    supabase.from('dietary_options').select('slug, label').eq('active', true).order('sort_order'),
    getSettings(),
  ])

  return (
    <main
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
    >
      <header className="hero-overlay text-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.12) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <span className="section-label">Your booking</span>
          <h1 className="section-title-white text-3xl md:text-4xl">Who is coming with you?</h1>
          <p className="mt-4 text-gray-300 leading-relaxed">
            {ticketLabel(order.ticket_type as TicketType)} confirmed, {order.seats}{' '}
            {order.seats === 1 ? 'seat' : 'seats'}. Add each guest below along with anything
            the kitchen needs to know.
          </p>
          <div
            className="mt-8 grid sm:grid-cols-3 gap-4 pt-6 text-sm"
            style={{ borderTop: '1px solid rgba(40,200,255,0.1)' }}
          >
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Date</p>
              <p className="font-bold mt-1">{formatEventDate(settings.event_date)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Venue</p>
              <p className="font-bold mt-1">{settings.venue}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Arrival</p>
              <p className="font-bold mt-1">
                From {settings.arrival_time}, {settings.dress_code.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookingForm
          token={token}
          seats={order.seats}
          buyerName={order.buyer_name ?? ''}
          initialGuests={guests ?? []}
          options={options ?? []}
          alreadyComplete={Boolean(order.details_completed_at)}
        />
      </div>
    </main>
  )
}
