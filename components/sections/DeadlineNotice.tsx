import { bookingClosed } from '@/lib/config'

/**
 * The most important thing on the page this week: a gold-bordered callout
 * saying tickets are required and when bookings close. Once the deadline
 * passes it switches itself to the closed message — nothing to remember.
 */
export default function DeadlineNotice() {
  const closed = bookingClosed()

  return (
    <div className="container-wide pt-10 -mb-4">
      <div
        className="rounded-sm p-6 md:p-7 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #fdf8ed 0%, #faeecf 100%)',
          border: '1.5px solid rgba(201, 168, 76, 0.55)',
          boxShadow: '0 4px 20px rgba(201, 168, 76, 0.15)',
        }}
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 bottom-0 w-1"
          style={{ background: 'linear-gradient(to bottom, #dda03a, #c9a84c, #b08a2e)' }}
        />
        {closed ? (
          <div className="pl-3">
            <p className="text-gold-700 text-xs font-bold tracking-[0.22em] uppercase mb-2">
              Ticket Sales Closed
            </p>
            <p className="text-navy-900 font-semibold text-base md:text-lg leading-snug">
              Ticket sales have now closed.
            </p>
            <p className="text-charcoal-700 text-sm md:text-base mt-2 leading-relaxed">
              If you still hope to join us on 10 September, email{' '}
              <a
                href="mailto:charlotte@lincolnshiremarketing.co.uk"
                className="font-semibold text-navy-900 underline underline-offset-2"
              >
                charlotte@lincolnshiremarketing.co.uk
              </a>{' '}
              and we will do what we can.
            </p>
          </div>
        ) : (
          <div className="pl-3">
            <p className="text-gold-700 text-xs font-bold tracking-[0.22em] uppercase mb-2">
              Bookings Close Friday 4 September, 12 Noon
            </p>
            <p className="text-navy-900 font-semibold text-base md:text-lg leading-snug">
              Tickets are required to attend. Being shortlisted does not automatically include
              a place at the dinner — every guest needs a ticket.
            </p>
            <p className="text-charcoal-700 text-sm md:text-base mt-2 leading-relaxed">
              Bookings close at 12 noon on Friday 4 September, and we cannot accept any
              bookings after that.{' '}
              <a href="/tickets" className="font-semibold text-navy-900 underline underline-offset-2">
                Book your tickets now
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/** The closed state for /tickets and /book, in place of the forms and Stripe buttons. */
export function BookingClosedPanel() {
  return (
    <div
      className="card p-8 md:p-10 text-center relative overflow-hidden"
      style={{ border: '1.5px solid rgba(201, 168, 76, 0.55)' }}
    >
      <span className="section-label">Ticket Sales Closed</span>
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">
        Ticket sales have now closed.
      </h2>
      <p className="mt-4 text-charcoal-700 leading-relaxed max-w-xl mx-auto">
        If you still hope to join us on 10 September, email{' '}
        <a
          href="mailto:charlotte@lincolnshiremarketing.co.uk"
          className="font-semibold text-navy-900 underline underline-offset-2"
        >
          charlotte@lincolnshiremarketing.co.uk
        </a>{' '}
        and we will do what we can.
      </p>
    </div>
  )
}
