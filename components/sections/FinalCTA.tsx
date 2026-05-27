import { event } from '@/content/site'

export default function FinalCTA() {
  return (
    <section className="section-tight bg-ink-900 border-t border-white/5">
      <div className="container-page">
        <div
          className="rounded-xl border border-mb-500/30 bg-gradient-to-br from-ink-800 to-ink-900
                     p-8 sm:p-12 relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-mb-500/20 blur-3xl"
          />
          <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <h2 className="h2">Join us at Mission Business 2026.</h2>
              <p className="body-lg mt-4 max-w-xl">
                Free to attend. Pre-registration required. Places are limited —
                last year&apos;s event sold out.
              </p>
              <p className="text-sm text-ink-300 mt-3">
                {event.dateLong} · {event.time} · {event.venueFull}
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
              <a href="#book" className="btn-primary-lg w-full md:w-auto">
                Secure your place
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
              <a href="#details" className="btn-ghost w-full md:w-auto">
                Full event details
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
