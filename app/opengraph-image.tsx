import { ImageResponse } from 'next/og'

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Lincolnshire Marketing Awards 2026 — Free to enter, independently judged, black-tie awards dinner, 10 September 2026.'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #040f2e 0%, #071d52 40%, #0a2d6e 100%)',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Geometric accent — top-right triangle */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 320px 220px 0',
            borderColor: 'transparent rgba(20,88,186,0.18) transparent transparent',
          }}
        />
        {/* Geometric accent — bottom-left triangle */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '180px 0 0 280px',
            borderColor: 'transparent transparent transparent rgba(20,88,186,0.14)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #28c8ff, #c9a84c, #28c8ff)',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '100px',
            width: '600px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(40,200,255,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 96px',
            position: 'relative',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '32px',
            }}
          >
            <div style={{ width: '32px', height: '2px', background: '#c9a84c' }} />
            <span
              style={{
                color: '#28c8ff',
                fontSize: '16px',
                fontWeight: '700',
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              Business Growth Awards · Lincolnshire · 2026
            </span>
          </div>

          {/* Heading */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '0.22em',
              fontSize: '80px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-1px',
              marginBottom: '36px',
            }}
          >
            <span>Lincolnshire</span>
            <span style={{ color: '#28c8ff' }}>Marketing</span>
            <span>Awards</span>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
            {[
              ['Free', 'To Enter'],
              ['15', 'Award Categories'],
              ['3 Judges', 'Per Entry'],
              ['Black Tie', '10 September 2026'],
            ].map(([val, label]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span
                  style={{
                    color: '#28c8ff',
                    fontSize: '26px',
                    fontWeight: '800',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {val}
                </span>
                <span
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '96px',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '1px',
          }}
        >
          lincolnshiremarketingawards.co.uk
        </div>
      </div>
    ),
    { ...size },
  )
}
