import { hero, event } from '@/content/site'

export default function Hero() {
  return (
    <section className="relative bg-grid pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mb-500/60 to-transparent"
      />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <span className="chip-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-mb-500" aria-hidden="true" />
            {hero.tag}
          </span>

          <h1 className="h1 mt-6">
            {hero.headline}{' '}
            <span className="text-mb-500">{hero.subheadline}</span>
          </h1>

          <p className="body-lg mt-6 max-w-2xl">{hero.body}</p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {hero.proofPoints.map((p) => (
              <li key={p} className="inline-flex items-center gap-2 text-sm text-ink-200">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 shrink-0 text-mb-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
                </svg>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
            <a href={hero.primaryCta.href} className="btn-primary-lg">
              {hero.primaryCta.label}
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h12m0 0l-4-4m4 4l-4 4" />
              </svg>
            </a>
            <a href={hero.secondaryCta.href} className="btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/5 pt-8">
            <Fact label="Date" value={event.dateLong} />
            <Fact label="Time" value={event.time} />
            <Fact label="Venue" value={`${event.venueName}, ${event.venueCity}`} />
            <Fact label="Price" value={event.price} />
          </dl>
        </div>
      </div>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-ink-400">{label}</dt>
      <dd className="mt-1 text-sm md:text-base font-medium text-white">{value}</dd>
    </div>
  )
}
