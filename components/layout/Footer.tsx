import Link from 'next/link'

const quickLinks = [
  { label: 'About the Awards', href: '/#about' },
  { label: 'Award Categories',  href: '/#categories' },
  { label: 'How It Works',      href: '/#how-it-works' },
  { label: 'Important Dates',   href: '/#dates' },
  { label: 'Judging & Fairness',href: '/#judging' },
  { label: 'Enter the Awards',  href: '/#enter' },
  { label: 'Apply to Judge',    href: '/#judge' },
]

const extraLinks = [
  { label: 'Sponsorship',   href: '/sponsorship' },
  { label: 'Past Winners',  href: '/past-winners' },
  { label: 'Sponsors',      href: '/#sponsors' },
  { label: 'Event Details', href: '/#event' },
  { label: 'FAQs',          href: '/#faqs' },
  { label: 'Contact',       href: '/#contact' },
]

export default function Footer() {
  return (
    <footer id="contact" role="contentinfo" className="bg-navy-950 text-gray-300">
      {/* Main footer */}
      <div className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gold-500 rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="text-navy-900 font-bold text-sm">LMA</span>
              </div>
              <div>
                <span className="block text-white font-semibold text-sm leading-tight">
                  Lincolnshire Marketing Awards
                </span>
                <span className="block text-gold-400 text-xs font-medium tracking-widest uppercase">
                  2026
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Recognising exceptional business growth across Lincolnshire. Free to enter,
              independently judged, black-tie awards dinner — September 2026.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/lincolnshire-marketing/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lincolnshire Marketing on LinkedIn"
                className="w-9 h-9 rounded-sm bg-navy-800 hover:bg-gold-500 flex items-center justify-center
                           text-gray-400 hover:text-navy-900 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/lincolnshiremarketing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lincolnshire Marketing on Facebook"
                className="w-9 h-9 rounded-sm bg-navy-800 hover:bg-gold-500 flex items-center justify-center
                           text-gray-400 hover:text-navy-900 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/lincolnshiremarketing/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lincolnshire Marketing on Instagram"
                className="w-9 h-9 rounded-sm bg-navy-800 hover:bg-gold-500 flex items-center justify-center
                           text-gray-400 hover:text-navy-900 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold-400 transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-5">
              More
            </h3>
            <ul className="space-y-2.5">
              {extraLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold-400 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & CTA */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-5">
              Get In Touch
            </h3>
            <address className="not-italic text-sm text-gray-400 space-y-3 mb-6">
              <p>
                Organised by{' '}
                <a
                  href="https://www.lincolnshiremarketing.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 underline underline-offset-2"
                >
                  Lincolnshire Marketing
                </a>
              </p>
              <p>
                <a
                  href="mailto:hello@lincolnshiremarketing.co.uk"
                  className="hover:text-gold-400 transition-colors"
                >
                  hello@lincolnshiremarketing.co.uk
                </a>
              </p>
            </address>
            <a href="/#enter" className="btn-outline-gold text-xs py-2.5 px-5 block text-center">
              Enter the Awards
            </a>
            <div className="mt-4">
              <Link
                href="/sponsorship"
                className="block text-center text-xs text-gray-500 hover:text-gold-400 transition-colors py-2"
              >
                Interested in sponsoring? →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Lincolnshire Marketing Awards. All rights reserved.
            Organised by{' '}
            <a
              href="https://www.lincolnshiremarketing.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400 transition-colors"
            >
              Lincolnshire Marketing
            </a>
            .
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Free to enter</span>
            <span className="text-navy-700">·</span>
            <span>Independently judged</span>
            <span className="text-navy-700">·</span>
            <span>September 2026</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
