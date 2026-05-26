import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: '5px',
        }}
      >
        <span
          style={{
            color: '#28c8ff',
            fontSize: '13px',
            fontWeight: '800',
            letterSpacing: '-0.5px',
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
