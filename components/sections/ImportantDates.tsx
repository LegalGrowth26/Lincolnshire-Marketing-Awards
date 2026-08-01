const timelineEvents = [
  {
    id: 1,
    date: 'Early May 2026',
    title: 'Entries Open',
    description: 'The entry portal goes live. Read through the categories and start crafting your submission.',
    icon: '🚀',
    status: 'upcoming',
  },
  {
    id: 2,
    date: 'Late July 2026',
    title: 'Entry Deadline',
    description: 'All entries must be submitted by the deadline. Late entries cannot be accepted.',
    icon: '📋',
    status: 'upcoming',
  },
  {
    id: 3,
    date: 'August 2026',
    title: 'Judging Period',
    description: 'Independent judges assess all submissions. Three judges per entry, scored on merit alone.',
    icon: '⚖️',
    status: 'upcoming',
  },
  {
    id: 4,
    date: 'Late August 2026',
    title: 'Shortlist Announced',
    description: 'Finalists are notified and publicly announced. All shortlisted businesses receive promotional assets.',
    icon: '📣',
    status: 'upcoming',
  },
  {
    id: 5,
    date: '10 September 2026',
    title: 'Awards Night',
    description: 'A prestigious black-tie dinner at the DoubleTree by Hilton, Lincoln. Winners revealed on the night.',
    icon: '🏆',
    status: 'upcoming',
  },
]

export default function ImportantDates() {
  return (
    <section
      id="dates"
      aria-labelledby="dates-heading"
      className="section-py"
      style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
    >
      <div className="container-wide">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="section-label">Key Dates</span>
          <h2 id="dates-heading" className="section-title mb-5">
            Important Dates for 2026
          </h2>
          <p className="section-body">
            Mark your diary. The entry window is limited. Don&apos;t miss your chance to be
            recognised at Lincolnshire&apos;s premier business awards.
          </p>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block relative mb-16" aria-label="Timeline of key dates">
          {/* Connector line */}
          <div
            aria-hidden="true"
            className="absolute top-10 left-[10%] right-[10%] h-0.5 timeline-connector"
          />

          <div className="grid grid-cols-5 gap-4">
            {timelineEvents.map((event, idx) => (
              <div key={event.id} className="flex flex-col items-center text-center">
                {/* Node */}
                <div
                  className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-5"
                  aria-hidden="true"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f0f5ff)',
                    border: '2px solid rgba(40,200,255,0.3)',
                    boxShadow: '0 0 20px rgba(40,200,255,0.15), 0 4px 12px rgba(10,45,110,0.1)',
                  }}
                >
                  <span className="text-2xl">{event.icon}</span>
                </div>

                {/* Date */}
                <div className="text-sky-500 font-bold text-xs mb-1.5 tracking-wide">
                  {event.date}
                </div>

                {/* Title */}
                <h3 className="font-bold text-navy-900 text-sm mb-2">{event.title}</h3>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden relative">
          {/* Vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-6 top-6 bottom-6 w-0.5 timeline-connector"
          />

          <ol className="space-y-8 relative" aria-label="Timeline of key dates">
            {timelineEvents.map((event) => (
              <li key={event.id} className="flex gap-6 pl-1">
                {/* Node */}
                <div
                  className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f0f5ff)',
                    border: '2px solid rgba(40,200,255,0.3)',
                    boxShadow: '0 0 16px rgba(40,200,255,0.15)',
                  }}
                >
                  <span className="text-lg">{event.icon}</span>
                </div>

                {/* Content */}
                <div className="pb-2">
                  <div className="text-sky-500 font-bold text-xs mb-1 tracking-wide">
                    {event.date}
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm mb-1.5">{event.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div
          className="rounded-sm p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, #071d52 0%, #0a2d6e 100%)',
            border: '1px solid rgba(40,200,255,0.15)',
            boxShadow: '0 8px 32px rgba(7,29,82,0.2)',
          }}
        >
          <div>
            <h3 className="font-bold text-white text-base mb-1">
              Don&apos;t miss the entry deadline
            </h3>
            <p className="text-sm text-gray-300">
              Entries open in early May 2026. Deadline is late July. Be ready.
            </p>
          </div>
          <a href="#enter" className="btn-gold flex-shrink-0">
            Set a Reminder &amp; Enter
          </a>
        </div>
      </div>
    </section>
  )
}
