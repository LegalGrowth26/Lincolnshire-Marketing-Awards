import { event } from '@/content/site'

const items = [
  {
    label: 'Date',
    value: event.dateLong,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3M17 3v3M3 9h18M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
    ),
  },
  {
    label: 'Time',
    value: event.time,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    label: 'Venue',
    value: `${event.venueName}, ${event.venueCity}, ${event.venuePostcode}`,
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
  },
  {
    label: 'Includes',
    value: 'Light lunch and dedicated networking time',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8M9 10V6a3 3 0 016 0v4" />
    ),
  },
]

export default function EventDetails() {
  return (
    <section id="details" className="section bg-ink-950">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">Event details</span>
          <h2 className="h2 mt-4">Logistics, in plain English.</h2>
          <p className="body-lg mt-5">
            Everything you need to know to plan your day.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map((i) => (
            <div key={i.label} className="card flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center
                           rounded-md bg-mb-500/10 border border-mb-500/30 text-mb-500"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  {i.icon}
                </svg>
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-ink-400">{i.label}</p>
                <p className="text-base text-white mt-1">{i.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 card-flat border-mb-500/30 bg-mb-500/5">
          <div className="flex items-start gap-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 mt-0.5 text-mb-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
            <p className="text-sm text-ink-100">
              <strong className="font-semibold text-white">Pre-registration is required.</strong>{' '}
              Attendee details are required in advance to help facilitate access to the base on
              the day. Please book early — last year sold out.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
