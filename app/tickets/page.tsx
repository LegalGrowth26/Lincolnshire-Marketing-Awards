import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSettings, formatEventDate, priceDisplay, tablePerPersonPence } from '@/lib/config'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Tickets | Lincolnshire Marketing Awards 2026',
  description:
    'Book your place at the Lincolnshire Marketing Awards 2026 black tie dinner at the DoubleTree by Hilton, Lincoln.',
}

export default async function TicketsPage() {
  const settings = await getSettings()

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero band */}
        <header className="hero-overlay relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 900px 500px at 70% 15%, rgba(40,200,255,0.07) 0%, transparent 70%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.12) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="container-wide relative z-10 pt-36 pb-16 md:pt-44 md:pb-20">
            <span className="section-label">Awards Night</span>
            <h1 className="section-title-white text-4xl md:text-6xl mb-6">Book Your Seat</h1>
            <p className="text-gray-300 max-w-2xl leading-relaxed text-base md:text-lg">
              The Lincolnshire Marketing Awards 2026 dinner brings together the businesses behind
              the county&apos;s best work of the year. Winners are announced on the night.
            </p>
            <div
              className="grid sm:grid-cols-4 gap-4 mt-12 pt-8"
              style={{ borderTop: '1px solid rgba(40,200,255,0.1)' }}
            >
              <Detail label="Date" value={formatEventDate(settings.event_date)} />
              <Detail label="Venue" value={settings.venue} />
              <Detail label="Arrival" value={`From ${settings.arrival_time}`} />
              <Detail label="Dress code" value={settings.dress_code} />
            </div>
          </div>
        </header>

        <section
          className="section-py"
          style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
        >
          <div className="container-wide max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6">
              <TicketCard
                title="Single ticket"
                blurb="One seat at a shared table with other Lincolnshire businesses."
                href="/book?type=single"
                cta="Book a single ticket"
                price={priceDisplay(settings.ticket_price_single)}
                points={[
                  'One seat, drinks reception on arrival',
                  'Three course dinner',
                  'Seated with other businesses',
                  'Awards presentation and entertainment',
                ]}
              />
              <TicketCard
                title="Table of 8"
                blurb="Your own table. The right choice if you are bringing the team or clients."
                href="/book?type=table8"
                cta="Book a table of 8"
                featured
                price={priceDisplay(settings.ticket_price_table8)}
                priceNote={`Eight seats for under the price of seven, ${priceDisplay(
                  tablePerPersonPence(settings.ticket_price_table8),
                )} per person.`}
                points={[
                  'Eight seats, your table to fill',
                  'Drinks reception and three course dinner',
                  'Your company name on the table',
                  'Awards presentation and entertainment',
                ]}
              />
            </div>

            <div className="card mt-12 p-8">
              <h2 className="font-bold text-navy-900 text-xl tracking-tight">
                What happens after you book
              </h2>
              <div className="gold-divider mt-4 mb-6" aria-hidden="true" />
              <ol className="space-y-3 text-charcoal-700 list-decimal pl-5 leading-7">
                <li>
                  You choose your tickets, add your details, and pay securely through Stripe.
                </li>
                <li>
                  You add the name of everyone sitting with you, plus any dietary requirements or
                  access needs. It saves as you go, so you can come back when you know who is
                  coming.
                </li>
                <li>
                  We pass the final numbers and dietaries to the venue, and send you the running
                  order for the night a week before.
                </li>
              </ol>
              <p className="mt-6 text-sm text-gray-500">
                Questions about tickets or tables? Email{' '}
                <a
                  className="text-sky-500 hover:text-sky-600 underline underline-offset-4"
                  href="mailto:tom@lincolnshiremarketing.co.uk"
                >
                  tom@lincolnshiremarketing.co.uk
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-glass p-4">
      <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">{label}</p>
      <p className="text-white font-bold text-sm mt-1.5">{value}</p>
    </div>
  )
}

function TicketCard({
  title,
  blurb,
  points,
  href,
  cta,
  price,
  priceNote,
  featured = false,
}: {
  title: string
  blurb: string
  points: string[]
  href: string
  cta: string
  price: string
  priceNote?: string
  featured?: boolean
}) {
  return (
    <div
      className="card p-8 relative"
      style={featured ? { border: '1.5px solid rgba(201,168,76,0.45)' } : undefined}
    >
      {featured && <div className="cat-top-bar" aria-hidden="true" />}
      {featured && (
        <p className="text-gold-500 uppercase tracking-[0.2em] text-xs font-bold mb-4">
          Most popular
        </p>
      )}
      <h2 className="text-2xl font-bold text-navy-900 tracking-tight">{title}</h2>
      <p className="mt-4">
        <span className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
          {price}
        </span>{' '}
        <span className="text-sm font-medium text-gray-500">+ VAT</span>
      </p>
      {priceNote && <p className="mt-1.5 text-xs text-gray-500">{priceNote}</p>}
      <p className="mt-3 text-charcoal-700 leading-7">{blurb}</p>
      <ul className="mt-6 space-y-2.5 text-sm text-charcoal-700">
        {points.map((p) => (
          <li key={p} className="flex gap-2.5">
            <svg
              className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <a href={href} className={`${featured ? 'btn-gold' : 'btn-primary'} mt-8 w-full text-center`}>
        {cta}
      </a>
    </div>
  )
}
