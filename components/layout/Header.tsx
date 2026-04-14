'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'About',      href: '/#about' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Dates',      href: '/#dates' },
  { label: 'Judging',    href: '/#judging' },
  { label: 'Sponsors',   href: '/#sponsors' },
  { label: 'FAQs',       href: '/#faqs' },
]

export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-900 shadow-lg' : 'bg-navy-900/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Lincolnshire Marketing Awards — home"
          >
            <div className="flex-shrink-0 w-9 h-9 bg-gold-500 rounded-sm flex items-center justify-center">
              <span className="text-navy-900 font-bold text-sm tracking-tight">LMA</span>
            </div>
            <div className="hidden sm:block">
              <span className="block text-white font-semibold text-sm leading-tight tracking-wide">
                Lincolnshire Marketing Awards
              </span>
              <span className="block text-gold-400 text-xs font-medium tracking-widest uppercase">
                2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-gray-300 hover:text-gold-400 text-sm font-medium
                           transition-colors duration-150 rounded-sm"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/past-winners"
              className="px-3.5 py-2 text-gray-300 hover:text-gold-400 text-sm font-medium
                         transition-colors duration-150 rounded-sm"
            >
              Past Winners
            </Link>
            <Link
              href="/sponsorship"
              className="px-3.5 py-2 text-gray-300 hover:text-gold-400 text-sm font-medium
                         transition-colors duration-150 rounded-sm"
            >
              Sponsorship
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="/#enter" className="btn-gold text-xs py-2.5 px-5">
              Enter Now
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 text-white hover:text-gold-400 transition-colors"
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
        className={`lg:hidden bg-navy-950 border-t border-navy-800 transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-wide py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="px-4 py-3 text-gray-300 hover:text-gold-400 hover:bg-navy-800
                         text-sm font-medium rounded-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/past-winners"
            onClick={closeMenu}
            className="px-4 py-3 text-gray-300 hover:text-gold-400 hover:bg-navy-800
                       text-sm font-medium rounded-sm transition-colors"
          >
            Past Winners
          </Link>
          <Link
            href="/sponsorship"
            onClick={closeMenu}
            className="px-4 py-3 text-gray-300 hover:text-gold-400 hover:bg-navy-800
                       text-sm font-medium rounded-sm transition-colors"
          >
            Sponsorship
          </Link>
          <div className="pt-2 border-t border-navy-800 mt-2">
            <a href="/#enter" onClick={closeMenu} className="btn-gold w-full text-center text-xs py-3">
              Enter the Awards
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
