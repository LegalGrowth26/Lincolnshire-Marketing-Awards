import { getSettings, formatEventDate, ticketUrls } from '@/lib/config'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Tickets | Lincolnshire Marketing Awards 2026',
  description:
    'Book your place at the Lincolnshire Marketing Awards 2026 black tie dinner at the DoubleTree by Hilton, Lincoln.',
}

export default async function TicketsPage() {
  const settings = await getSettings()
  const urls = ticketUrls()

  return (
    <main className="bg-white text-neutral-900">
      <header className="bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="uppercase tracking-[0.2em] text-xs text-white/50 font-semibold">
            Awards night
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mt-5">Book your seat</h1>
          <p className="mt-6 text-white/70 max-w-2xl leading-relaxed text-lg">
            The Lincolnshire Marketing Awards 2026 dinner brings together the businesses behind
            the county&apos;s best work of the year. Winners are announced on the night.
          </p>
          <div className="grid sm:grid-cols-4 gap-6 mt-14 border-t border-white/15 pt-8">
            <Detail label="Date" value={formatEventDate(settings.event_date)} />
            <Detail label="Venue" value={settings.venue} />
            <Detail label="Arrival" value={`From ${settings.arrival_time}`} />
            <Detail label="Dress code" value={settings.dress_code} />
          </div>
        </div>
      </header>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <TicketCard
              title="Single ticket"
              blurb="One seat at a shared table with other Lincolnshire businesses."
              href={urls.single}
              cta="Book a single ticket"
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
              href={urls.table8}
              cta="Book a table of 8"
              featured
              points={[
                'Eight seats, your table to fill',
                'Drinks reception and three course dinner',
                'Your company name on the table',
                'Awards presentation and entertainment',
              ]}
            />
          </div>

          <div className="mt-14 border border-neutral-200 rounded-xl p-8">
            <h2 className="text-xl font-bold">What happens after you book</h2>
            <ol className="mt-5 space-y-3 text-neutral-600 list-decimal pl-5 leading-7">
              <li>
                You pay through Stripe and come straight back here to a private booking page.
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
            <p className="mt-6 text-sm text-neutral-500">
              Questions about tickets or tables? Email{' '}
              <a
                className="underline underline-offset-4"
                href="mailto:tom@lincolnshiremarketing.co.uk"
              >
                tom@lincolnshiremarketing.co.uk
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-white/40 text-sm">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  )
}

function TicketCard({
  title,
  blurb,
  points,
  href,
  cta,
  featured = false,
}: {
  title: string
  blurb: string
  points: string[]
  href: string
  cta: string
  featured?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-8 border ${
        featured ? 'border-neutral-900 border-2' : 'border-neutral-200'
      }`}
    >
      {featured && (
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-neutral-400 mb-4">
          Most popular
        </p>
      )}
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-3 text-neutral-600 leading-7">{blurb}</p>
      <ul className="mt-6 space-y-2 text-neutral-600 list-disc pl-5">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <a
        href={href}
        className="inline-flex mt-8 bg-neutral-950 text-white px-6 py-3 rounded-md font-semibold"
      >
        {cta}
      </a>
    </div>
  )
}
