/**
 * Hero section.
 *
 * Full-screen YouTube background video (HUvo9waiGeY) with a very dark overlay.
 * Falls back to the navy gradient if the iframe fails or is blocked.
 */

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Lincolnshire Marketing Awards 2026 hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-navy-950"
    >
      {/* Full-cover YouTube background video */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <iframe
          src="https://www.youtube-nocookie.com/embed/HUvo9waiGeY?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playlist=HUvo9waiGeY&playsinline=1&disablekb=1"
          title=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 'max(100vw, calc(100vh * 16 / 9))',
            height: 'max(100vh, calc(100vw * 9 / 16))',
            border: 'none',
          }}
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Very dark overlay */}
      <div className="absolute inset-0 bg-navy-950/93" aria-hidden="true" />

      {/* Subtle dot pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.07) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Sky accent top line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600"
      />

      <div className="container-wide relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-navy-900/60 border border-sky-400/30
                          rounded-sm px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" aria-hidden="true" />
            <span className="text-sky-200 text-xs font-semibold tracking-widest uppercase">
              Business Growth Awards · Lincolnshire · 2026
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            Lincolnshire
            <span className="block text-sky-400">Marketing</span>
            Awards
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-4 max-w-2xl mx-auto">
            Recognising exceptional business growth across Lincolnshire.
          </p>
          <p className="text-base text-gray-300 leading-relaxed mb-10 max-w-xl mx-auto">
            Open to all Lincolnshire businesses, from sole traders and start-ups to
            established employers and professional services firms. Free to enter.
            Independently judged. Black-tie awards dinner, September 2026.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#enter" className="btn-primary-lg">
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
          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 justify-center">
            {[
              ['15',        'Award Categories'],
              ['Free',      'To Enter'],
              ['3 Judges',  'Per Entry'],
              ['Black Tie', 'Awards Dinner'],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="text-sky-400 font-bold text-xl leading-none">{val}</div>
                <div className="text-gray-300 text-xs mt-1.5 font-medium uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70"
      >
        <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-sky-400/80 to-transparent" />
      </div>
    </section>
  )
}
