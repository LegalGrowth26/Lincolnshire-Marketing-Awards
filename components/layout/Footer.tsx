import Logo from '@/components/ui/Logo'
import { event, footer } from '@/content/site'

const navLinks = [
  { label: 'Why attend', href: '#why' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Speakers',   href: '#speakers' },
  { label: 'Details',    href: '#details' },
  { label: 'Partners',   href: '#partners' },
  { label: 'Book',       href: '#book' },
]

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-ink-950 border-t border-white/5">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="body-muted mt-5 max-w-md">{footer.tagline}</p>
            <p className="text-sm text-ink-400 mt-3">{footer.credit}</p>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-300 mb-4">
              On this page
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-6">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-ink-200 hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-300 mb-4">
              Event
            </h3>
            <ul className="space-y-2 text-sm text-ink-200">
              <li>{event.dateLong}</li>
              <li>{event.time}</li>
              <li>{event.venueName}</li>
              <li>{event.venueCity}, {event.venuePostcode}</li>
            </ul>
            <a href="#book" className="btn-primary mt-5 text-sm py-2.5 px-5">
              Register free
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-400">
            &copy; {new Date().getFullYear()} Mission Business. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-ink-400">
            <span>Free to attend</span>
            <span className="text-ink-600">·</span>
            <span>Pre-registration required</span>
            <span className="text-ink-600">·</span>
            <span>{event.dateShort}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
