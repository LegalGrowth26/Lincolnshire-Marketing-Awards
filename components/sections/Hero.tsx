/**
 * Hero section — premium dark treatment.
 *
 * Deep navy gradient + geometric wireframe shapes + light beam effects
 * inspired by luxury awards event branding.
 */

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Lincolnshire Marketing Awards 2026 hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #040f2e 0%, #071d52 35%, #0a2d6e 65%, #040f2e 100%)',
      }}
    >
      {/* ── Geometric wireframe shapes ── */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Bottom-left cluster */}
        <polygon points="0,900 320,680 0,560"
          fill="rgba(20,88,186,0.10)" stroke="rgba(40,200,255,0.14)" strokeWidth="0.6"/>
        <polygon points="0,820 220,700 100,900"
          fill="rgba(7,29,82,0.15)" stroke="rgba(40,200,255,0.09)" strokeWidth="0.6"/>
        <polygon points="60,900 290,770 180,680"
          fill="none" stroke="rgba(40,200,255,0.07)" strokeWidth="0.5"/>
        <polygon points="0,700 160,620 80,780"
          fill="rgba(20,88,186,0.06)" stroke="rgba(40,200,255,0.10)" strokeWidth="0.4"/>

        {/* Right side cluster */}
        <polygon points="1440,0 1180,180 1440,300"
          fill="rgba(20,88,186,0.10)" stroke="rgba(40,200,255,0.13)" strokeWidth="0.6"/>
        <polygon points="1440,350 1220,250 1440,150"
          fill="rgba(7,29,82,0.12)" stroke="rgba(40,200,255,0.08)" strokeWidth="0.5"/>
        <polygon points="1320,0 1440,120 1440,0"
          fill="rgba(20,88,186,0.08)" stroke="rgba(40,200,255,0.10)" strokeWidth="0.4"/>
        <polygon points="1440,500 1150,380 1350,600"
          fill="none" stroke="rgba(40,200,255,0.06)" strokeWidth="0.5"/>

        {/* Long diagonal structure lines */}
        <line x1="0" y1="580" x2="580" y2="0"
          stroke="rgba(40,200,255,0.055)" strokeWidth="0.5"/>
        <line x1="0" y1="720" x2="720" y2="0"
          stroke="rgba(40,200,255,0.04)" strokeWidth="0.4"/>
        <line x1="860" y1="900" x2="1440" y2="320"
          stroke="rgba(40,200,255,0.04)" strokeWidth="0.4"/>

        {/* Connecting node dots */}
        <circle cx="320" cy="680" r="2.5" fill="rgba(40,200,255,0.45)"/>
        <circle cx="220" cy="700" r="1.5" fill="rgba(40,200,255,0.35)"/>
        <circle cx="1180" cy="180" r="2.5" fill="rgba(40,200,255,0.4)"/>
        <circle cx="1220" cy="250" r="1.5" fill="rgba(40,200,255,0.3)"/>

        {/* Scattered particles */}
        <circle cx="420" cy="140" r="2" fill="rgba(40,200,255,0.5)"/>
        <circle cx="580" cy="90" r="1.5" fill="rgba(40,200,255,0.4)"/>
        <circle cx="760" cy="160" r="2.5" fill="rgba(40,200,255,0.35)"/>
        <circle cx="920" cy="80" r="1.5" fill="rgba(40,200,255,0.4)"/>
        <circle cx="1060" cy="200" r="2" fill="rgba(40,200,255,0.3)"/>
        <circle cx="340" cy="360" r="1.5" fill="rgba(201,168,76,0.45)"/>
        <circle cx="680" cy="320" r="1" fill="rgba(40,200,255,0.3)"/>
        <circle cx="860" cy="420" r="1.5" fill="rgba(40,200,255,0.25)"/>
        <circle cx="1100" cy="380" r="1" fill="rgba(201,168,76,0.35)"/>
        <circle cx="500" cy="460" r="1" fill="rgba(40,200,255,0.2)"/>
        <circle cx="140" cy="400" r="1.5" fill="rgba(40,200,255,0.25)"/>
        <circle cx="200" cy="260" r="1" fill="rgba(40,200,255,0.3)"/>
      </svg>

      {/* ── Light beam — upper right ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '-180px',
          right: '80px',
          width: '180px',
          height: '1100px',
          background: 'linear-gradient(to bottom, rgba(40,200,255,0.22) 0%, rgba(40,200,255,0.06) 40%, transparent 80%)',
          transform: 'rotate(-28deg)',
          transformOrigin: 'top center',
          filter: 'blur(3px)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '-180px',
          right: '260px',
          width: '80px',
          height: '800px',
          background: 'linear-gradient(to bottom, rgba(40,200,255,0.16) 0%, rgba(40,200,255,0.04) 50%, transparent 80%)',
          transform: 'rotate(-22deg)',
          transformOrigin: 'top center',
          filter: 'blur(2px)',
        }}
      />

      {/* ── Radial ambient glow ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 900px 500px at 70% 15%, rgba(40,200,255,0.07) 0%, transparent 70%)',
            'radial-gradient(ellipse 500px 400px at 10% 90%, rgba(20,88,186,0.12) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

      {/* ── Fine dot grid ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.12) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Sky accent top line ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #28c8ff 30%, #c9a84c 60%, transparent)' }}
      />

      {/* ── Content ── */}
      <div className="container-wide relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-3 rounded-sm px-5 py-2.5 mb-10 border"
          style={{
            background: 'rgba(40,200,255,0.05)',
            borderColor: 'rgba(40,200,255,0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            className="w-px h-4 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #c9a84c, #28c8ff)' }}
            aria-hidden="true"
          />
          <span className="text-sky-300 text-xs font-semibold tracking-[0.22em] uppercase">
            Business Growth Awards · Lincolnshire · 2026
          </span>
        </div>

        <h1
          className="font-bold text-white leading-[1.02] mb-7"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            letterSpacing: '-0.02em',
            maxWidth: '14ch',
          }}
        >
          Lincolnshire
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, #28c8ff 0%, #00aee6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Marketing
          </span>
          Awards
        </h1>

        <p
          className="text-gray-200 leading-relaxed mb-4"
          style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)', maxWidth: '52ch' }}
        >
          Recognising exceptional business growth across Lincolnshire.
        </p>
        <p
          className="text-gray-400 leading-relaxed mb-11"
          style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', maxWidth: '60ch' }}
        >
          Open to all Lincolnshire businesses, from sole traders and start-ups to
          established employers and professional services firms. Free to enter.
          Independently judged. Black-tie awards dinner, September 2026.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
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
        <div
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 pt-10"
          style={{ borderTop: '1px solid rgba(40,200,255,0.1)' }}
        >
          {[
            ['15',        'Award Categories'],
            ['Free',      'To Enter'],
            ['3 Judges',  'Per Entry'],
            ['Black Tie', 'Awards Dinner'],
          ].map(([val, label]) => (
            <div key={label}>
              <div
                className="font-bold text-xl leading-none mb-1.5"
                style={{
                  background: 'linear-gradient(135deg, #28c8ff, #00aee6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {val}
              </div>
              <div className="text-gray-400 text-xs font-medium uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60"
      >
        <span className="text-sky-300 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, #28c8ff, transparent)' }}
        />
      </div>
    </section>
  )
}
