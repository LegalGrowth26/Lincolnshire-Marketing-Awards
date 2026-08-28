import { getSettings, priceDisplay, tablePerPersonPence } from '@/lib/config'

/**
 * Closing call to action — book tickets for the awards night, with prices
 * from settings. Reuses the deep navy gradient panel treatment used across
 * the site.
 */
export default async function BookTickets() {
  const settings = await getSettings()
  const single = priceDisplay(settings.ticket_price_single)
  const table = priceDisplay(settings.ticket_price_table8)
  const perPerson = priceDisplay(tablePerPersonPence(settings.ticket_price_table8))

  return (
    <section
      id="tickets-cta"
      aria-labelledby="tickets-cta-heading"
      className="section-py"
      style={{ background: 'linear-gradient(160deg, #f5f8ff 0%, #eef3fb 100%)' }}
    >
      <div className="container-wide">
        <div
          className="rounded-sm p-8 md:p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #040f2e 0%, #071d52 40%, #0a2d6e 100%)',
            boxShadow: '0 0 60px rgba(40,200,255,0.06) inset',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(40,200,255,0.07) 0%, transparent 70%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.08) 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }}
          />
          <div className="relative z-10">
            <span className="section-label">Awards Night</span>
            <h2 id="tickets-cta-heading" className="section-title-white mb-4">
              Join Us on the Night
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-4 leading-relaxed">
              Thursday 10 September 2026 at the DoubleTree by Hilton, Lincoln.
              Arrival from 7:00pm, black tie. Winners revealed on the night.
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-5 mb-8">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">
                  Single ticket
                </p>
                <p className="text-white font-bold text-2xl mt-1">
                  {single} <span className="text-sm font-medium text-gray-400">+ VAT</span>
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">
                  Table of 8
                </p>
                <p className="text-white font-bold text-2xl mt-1">
                  {table} <span className="text-sm font-medium text-gray-400">+ VAT</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Eight seats for under the price of seven, {perPerson} per person.
                </p>
              </div>
            </div>
            <a href="/tickets" className="btn-gold-lg">
              Book Your Tickets
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
