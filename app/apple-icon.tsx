import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #071d52, #0a2d6e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '24px',
        }}
      >
        <span
          style={{
            color: '#28c8ff',
            fontSize: '72px',
            fontWeight: '800',
            letterSpacing: '-2px',
            fontFamily: 'sans-serif',
          }}
        >
          LMA
        </span>
      </div>
    ),
    { ...size },
  )
}
