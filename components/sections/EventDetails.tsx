const details = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    label: 'Date',
    value: 'September 2026',
    note: 'Exact date to be confirmed',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Venue',
    value: 'Lincolnshire',
    note: 'Venue to be confirmed',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Arrival',
    value: 'From 6:30pm',
    note: 'Drinks reception from 6:30pm',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    label: 'Dress Code',
    value: 'Black Tie',
    note: 'Formal attire required',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    label: 'Format',
    value: 'Awards Dinner',
    note: 'Drinks reception, dinner & ceremony',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
    label: 'Tickets',
    value: 'Available Soon',
    note: 'Priority for shortlisted businesses',
  },
]

export default function EventDetails() {
  return (
    <section id="event" aria-labelledby="event-heading" className="section-py bg-navy-900 relative overflow-hidden">
      {/* Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.07) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Details */}
          <div>
            <span className="section-label">The Event</span>
            <h2 id="event-heading" className="section-title-white mb-6">
              Awards Night 2026
            </h2>
            <div className="w-12 h-0.5 bg-gold-500 mb-8" aria-hidden="true" />

            <p className="text-gray-300 leading-relaxed mb-10">
              The Lincolnshire Marketing Awards 2026 culminates in a prestigious black-tie
              dinner — an evening of celebration, recognition, and connection for the best
              businesses in Lincolnshire. Full venue and date details will be announced soon.
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map(({ icon, label, value, note }) => (
                <div
                  key={label}
                  className="bg-navy-800/60 border border-navy-700 rounded-sm p-5
                             hover:border-gold-500/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gold-400 flex-shrink-0" aria-hidden="true">{icon}</div>
                    <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">{label}</span>
                  </div>
                  <div className="text-white font-bold text-sm mb-0.5">{value}</div>
                  <div className="text-gray-500 text-xs">{note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — What to expect */}
          <div>
            <div className="bg-navy-800/40 border border-navy-700 rounded-sm p-8">
              <h3 className="text-white font-bold text-lg mb-6">What to Expect on the Night</h3>

              <ol className="space-y-5">
                {[
                  {
                    time: '6:30pm',
                    event: 'Arrival & Drinks Reception',
                    desc: 'Welcome drinks and canapés. A chance to connect with other finalists and guests before the evening begins.',
                  },
                  {
                    time: '7:30pm',
                    event: 'Be Seated & Welcome',
                    desc: 'Guests take their seats for a warm welcome from the host and organisers.',
                  },
                  {
                    time: '8:00pm',
                    event: 'Dinner Served',
                    desc: 'A three-course dinner in elegant surroundings.',
                  },
                  {
                    time: '9:00pm',
                    event: 'Awards Ceremony',
                    desc: 'The moment everyone is waiting for. All 15 award categories presented, with winners revealed live on the night.',
                  },
                  {
                    time: 'Late',
                    event: 'Networking & Celebration',
                    desc: 'An open bar and live entertainment to round off a memorable evening.',
                  },
                ].map(({ time, event, desc }) => (
                  <li key={time} className="flex gap-4">
                    <div className="flex-shrink-0 text-gold-400 font-bold text-xs pt-0.5 w-14">{time}</div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">{event}</div>
                      <div className="text-gray-400 text-xs leading-relaxed">{desc}</div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 pt-6 border-t border-navy-700">
                <p className="text-gray-400 text-sm text-center">
                  Venue, exact date, and ticketing details to be announced.
                </p>
                <a
                  href="mailto:hello@lincolnshiremarketing.co.uk"
                  className="block text-center text-gold-400 hover:text-gold-300 text-sm font-medium mt-2 underline underline-offset-2"
                >
                  Register your interest →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
