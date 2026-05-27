'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

const navLinks = [
  { label: 'Why attend', href: '#why' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Speakers',   href: '#speakers' },
  { label: 'Details',    href: '#details' },
  { label: 'Partners',   href: '#partners' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <header
      role="banner"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-ink-950/90 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" aria-label="Mission Business 2026 home" className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-ink-200 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <a href="#book" className="btn-primary text-sm py-2.5 px-5">
              Register free
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-white"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden bg-ink-950 border-t border-white/5 transition-[max-height] duration-200 ease-out ${
          menuOpen ? 'max-h-[480px]' : 'max-h-0'
        }`}
      >
        <div className="container-page py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="px-2 py-3 text-base text-ink-200 hover:text-white border-b border-white/5"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#book"
            onClick={close}
            className="btn-primary mt-4 w-full"
          >
            Register free
          </a>
        </div>
      </div>
    </header>
  )
}
