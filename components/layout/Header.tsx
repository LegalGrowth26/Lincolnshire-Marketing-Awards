'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { AWARD_YEARS } from '@/content/awards'

const navLinks = [
  { label: 'Judges', href: '/judges' },
]

/**
 * The Winners nav item. Data-driven from content/awards: with one year it
 * renders as a plain link; the moment a second year is added to the index it
 * becomes a dropdown listing every year, newest first. No rebuild of this
 * component needed next September.
 */
function WinnersNavItem({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean
  onNavigate?: () => void
}) {
  const [open, setOpen] = useState(false)
  const linkClass = mobile
    ? `px-4 py-3 text-gray-300 hover:text-white hover:bg-navy-800
       text-sm font-medium rounded-sm transition-colors`
    : `px-3.5 py-2 text-white/80 hover:text-white text-sm font-medium
       transition-colors duration-150 rounded-sm`

  if (AWARD_YEARS.length === 1) {
    return (
      <Link href={`/winners/${AWARD_YEARS[0].year}`} onClick={onNavigate} className={linkClass}>
        Winners
      </Link>
    )
  }

  if (mobile) {
    return (
      <>
        {AWARD_YEARS.map((y) => (
          <Link
            key={y.year}
            href={`/winners/${y.year}`}
            onClick={onNavigate}
            className={linkClass}
          >
            Winners {y.year}
          </Link>
        ))}
      </>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={`${linkClass} inline-flex items-center gap-1`}
      >
        Winners
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full pt-1 min-w-[9rem] z-50"
        >
          <div className="bg-navy-900 border border-navy-800 rounded-sm py-1 shadow-lg">
            {AWARD_YEARS.map((y) => (
              <Link
                key={y.year}
                href={`/winners/${y.year}`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-navy-800"
              >
                {y.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900 shadow-lg'
          : 'bg-navy-600'
      }`}
    >
      {/* Gold top accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600"
      />

      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group flex-shrink-0"
            aria-label="Lincolnshire Marketing Awards home"
          >
            <Logo variant="white" width={180} className="transition-opacity duration-150 group-hover:opacity-90" />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            <WinnersNavItem />
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-white/80 hover:text-white text-sm font-medium
                           transition-colors duration-150 rounded-sm"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/sponsorship"
              className="px-3.5 py-2 text-white/80 hover:text-white text-sm font-medium
                         transition-colors duration-150 rounded-sm"
            >
              Sponsorship
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/winners/2026" className="btn-gold text-xs py-2.5 px-5">
              2026 Winners
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 text-white hover:text-sky-300 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className={`lg:hidden bg-navy-900 border-t border-navy-800 transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-wide py-4 flex flex-col gap-1">
          <WinnersNavItem mobile onNavigate={closeMenu} />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="px-4 py-3 text-gray-300 hover:text-white hover:bg-navy-800
                         text-sm font-medium rounded-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/sponsorship"
            onClick={closeMenu}
            className="px-4 py-3 text-gray-300 hover:text-white hover:bg-navy-800
                       text-sm font-medium rounded-sm transition-colors"
          >
            Sponsorship
          </Link>
          <div className="pt-3 border-t border-navy-800 mt-2">
            <a href="/winners/2026" onClick={closeMenu} className="btn-gold w-full text-center text-xs py-3">
              2026 Winners
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
