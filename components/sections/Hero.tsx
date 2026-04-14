/**
 * Hero section.
 *
 * Background: when /images/event-dinner.jpg exists it becomes a subtle
 * atmospheric layer beneath the brand-blue gradient. The gradient is fully
 * opaque if the image is absent, so the section looks great either way.
 */

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Lincolnshire Marketing Awards 2026 hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        /*
         * Layer 1 (top): brand-blue gradient — darkest at top-left fading to mid-blue
         * Layer 2 (bottom): event photo — provides atmospheric texture when present.
         * The gradient opacity is set so the photo is subtly visible but text stays legible.
         * If the photo is missing the fallback solid colour still looks clean.
         */
        backgroundImage: [
          'linear-gradient(140deg, rgba(7,29,82,0.97) 0%, rgba(10,45,110,0.90) 45%, rgba(13,58,132,0.88) 100%)',
          "url('/images/event-dinner.jpg')",
        ].join(', '),
        backgroundSize:     'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat:   'no-repeat, no-repeat',
      }}
    >
      {/* Subtle dot pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.10) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Gold top line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
      />

      <div className="container-wide relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-navy-900/60 border border-gold-500/30
                            rounded-sm px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" aria-hidden="true" />
              <span className="text-gold-300 text-xs font-semibold tracking-widest uppercase">
                Business Growth Awards · Lincolnshire · 2026
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
              Lincolnshire
              <span className="block text-gold-400">Marketing</span>
              Awards
            </h1>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-4 max-w-lg">
              Recognising exceptional business growth across Lincolnshire.
            </p>
            <p className="text-base text-gray-400 leading-relaxed mb-10 max-w-lg">
              Open to all Lincolnshire businesses, from sole traders and start-ups to
              established employers and professional services firms. Free to enter.
              Independently judged. Black-tie awards dinner, September 2026.
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
                ['15',         'Award Categories'],
                ['Free',       'To Enter'],
                ['3 Judges',   'Per Entry'],
                ['Black Tie',  'Awards Dinner'],
              ].map(([val, label]) => (
                <div key={label}>
                  <div className="text-gold-400 font-bold text-lg leading-none">{val}</div>
                  <div className="text-gray-400 text-xs mt-1 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — award imagery panel */}
          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl scale-150" />

              {/* Main circle */}
              <div
                className="relative w-72 h-72 rounded-full border border-gold-500/25
                            flex items-center justify-center overflow-hidden"
                style={{
                  background: 'radial-gradient(circle, rgba(21,88,186,0.3) 0%, rgba(7,29,82,0.6) 70%)',
                }}
              >
                {/* Winner photo when available */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/award-winner-1.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-50 rounded-full"
                />

                {/* Trophy SVG overlay (shown when no image or alongside image) */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <svg viewBox="0 0 80 90" fill="none" className="w-28 h-28 opacity-90" aria-hidden="true">
                    <path d="M18 8h44l-6 42c-1.5 10-8 16-16 16s-14.5-6-16-16L18 8z"
                          fill="rgba(201,168,76,0.2)" stroke="#c9a84c" strokeWidth="2" />
                    <path d="M18 16c-10 0-16 8-12 18l4 6" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M62 16c10 0 16 8 12 18l-4 6" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <rect x="36" y="66" width="8" height="12" rx="2" fill="#c9a84c" opacity="0.8" />
                    <rect x="22" y="78" width="36" height="7" rx="1.5" fill="#c9a84c" />
                    <path d="M40 24l2.5 7.5 8 0-6.5 4.7 2.5 7.5L40 39.2l-6.5 4.5 2.5-7.5-6.5-4.7 8 0z"
                          fill="#c9a84c" opacity="0.7" />
                  </svg>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute -top-3 -right-4 bg-gold-500 text-navy-950 font-bold text-xs
                              px-3 py-1.5 rounded-sm shadow-lg">
                Sept 2026
              </div>
              <div className="absolute -bottom-3 -left-4 bg-navy-800 border border-gold-500/40 text-gold-300
                              font-semibold text-xs px-3 py-1.5 rounded-sm shadow-lg">
                3rd Annual Event
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
      >
        <span className="text-gray-300 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold-400/80 to-transparent" />
      </div>
    </section>
  )
}
