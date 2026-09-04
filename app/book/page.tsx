import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { sql } from '@/lib/db'
import { BookingClosedPanel } from '@/components/sections/DeadlineNotice'
import {
  getSettings,
  formatEventDate,
  priceDisplay,
  tablePerPersonPence,
  bookingClosed,
} from '@/lib/config'
import BookForm from './book-form'
import type { TicketType } from '@/lib/orders'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Book | Lincolnshire Marketing Awards 2026',
  description:
    'Book your place at the Lincolnshire Marketing Awards 2026 black tie dinner at the DoubleTree by Hilton, Lincoln.',
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const initialType: TicketType = searchParams?.type === 'table8' ? 'table8' : 'single'

  const settings = await getSettings()

  let options: { slug: string; label: string }[] = []
  try {
    options = await sql`
      select slug, label from dietary_options where active = true order by sort_order`
  } catch {
    options = [] // the booking link collects dietaries after payment
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <header className="hero-overlay text-white relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.12) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 md:pt-36 relative z-10">
            <span className="section-label">Awards Night</span>
            <h1 className="section-title-white text-3xl md:text-5xl">Book your place</h1>
            <p className="mt-4 text-gray-300 leading-relaxed">
              {formatEventDate(settings.event_date)} at {settings.venue}. Arrival from{' '}
              {settings.arrival_time}, {settings.dress_code.toLowerCase()}. Winners revealed on
              the night.
            </p>
          </div>
        </header>

        <div
          className="py-12 md:py-16"
          style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {bookingClosed() ? (
              <BookingClosedPanel />
            ) : (
              <BookForm
                initialType={initialType}
                options={options}
                prices={{
                  single: priceDisplay(settings.ticket_price_single),
                  table8: priceDisplay(settings.ticket_price_table8),
                  perPerson: priceDisplay(tablePerPersonPence(settings.ticket_price_table8)),
                }}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
