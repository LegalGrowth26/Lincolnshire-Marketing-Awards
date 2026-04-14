import Link from 'next/link'

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      {/* Cup body */}
      <path
        d="M18 8h44l-6 42c-1.5 10-8 16-16 16s-14.5-6-16-16L18 8z"
        fill="rgba(201,168,76,0.15)"
        stroke="#c9a84c"
        strokeWidth="2"
      />
      {/* Left handle */}
      <path
        d="M18 16c-10 0-16 8-12 18l4 6"
        stroke="#c9a84c"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right handle */}
      <path
        d="M62 16c10 0 16 8 12 18l-4 6"
        stroke="#c9a84c"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Stem */}
      <rect x="36" y="66" width="8" height="14" rx="2" fill="#c9a84c" opacity="0.7" />
      {/* Base */}
      <rect x="22" y="80" width="36" height="8" rx="2" fill="#c9a84c" opacity="0.9" />
      {/* Star */}
      <path
        d="M40 24l2.5 7.5 8 0-6.5 4.7 2.5 7.5L40 39.2l-6.5 4.5 2.5-7.5-6.5-4.7 8 0z"
        fill="#c9a84c"
        opacity="0.6"
      />
    </svg>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Lincolnshire Marketing Awards 2026 — hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(140deg, #060e22 0%, #0d1b3e 50%, #162558 100%)',
      }}
    >
      {/* Dot pattern overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.12) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Gold accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
      />

      <div className="container-wide relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-navy-800/60 border border-gold-500/30
                            rounded-sm px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" aria-hidden="true" />
              <span className="text-gold-300 text-xs font-semibold tracking-widest uppercase">
                Lincolnshire · 2026
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
              Lincolnshire
              <span className="block text-gold-400">Marketing</span>
              Awards
            </h1>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4 max-w-lg">
              Recognising exceptional business growth across Lincolnshire.
            </p>
            <p className="text-base text-gray-400 leading-relaxed mb-10 max-w-lg">
              Free to enter. Independently judged. A prestigious black-tie awards dinner
              celebrating the businesses driving our county forward.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#enter" className="btn-gold-lg">
                Enter the Awards
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a href="#categories" className="btn-outline-white">
                View Categories
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {[
                ['15', 'Award Categories'],
                ['Free', 'To Enter'],
                ['Independent', 'Judging Panel'],
                ['Black Tie', 'Awards Dinner'],
              ].map(([val, label]) => (
                <div key={label}>
                  <div className="text-gold-400 font-bold text-lg leading-none">{val}</div>
                  <div className="text-gray-400 text-xs mt-1 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trophy graphic */}
          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl scale-150" />
              {/* Circle backdrop */}
              <div
                className="relative w-72 h-72 rounded-full border border-gold-500/20 flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
              >
                <div className="w-36 h-44">
                  <TrophyIcon />
                </div>
              </div>
              {/* Orbiting badge — top right */}
              <div className="absolute -top-3 -right-3 bg-gold-500 text-navy-900 font-bold text-xs
                              px-3 py-1.5 rounded-sm shadow-lg">
                Sept 2026
              </div>
              {/* Orbiting badge — bottom left */}
              <div className="absolute -bottom-3 -left-3 bg-navy-800 border border-gold-500/40 text-gold-300
                              font-semibold text-xs px-3 py-1.5 rounded-sm shadow-lg">
                Max 3 categories
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
      >
        <span className="text-gray-400 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold-500/80 to-transparent" />
      </div>
    </section>
  )
}
