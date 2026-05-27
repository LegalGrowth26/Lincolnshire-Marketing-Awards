import { highlights } from '@/content/site'

export default function Highlights() {
  return (
    <section id="highlights" className="section bg-ink-900 border-y border-white/5">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow">Event highlights</span>
            <h2 className="h2 mt-4">What to expect on the day.</h2>
          </div>
          <p className="body-muted max-w-sm">
            A practical, high-signal agenda. No filler.
            Last year&apos;s event sold out, so places are limited.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <li
              key={h.title}
              className="card-flat flex items-start gap-4"
            >
              <span
                aria-hidden="true"
                className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md
                           bg-mb-500/10 border border-mb-500/30"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 text-mb-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">{h.title}</h3>
                <p className="text-sm text-ink-300 mt-1.5 leading-relaxed">{h.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
