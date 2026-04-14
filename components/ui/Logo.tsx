/**
 * SVG recreation of the Lincolnshire Marketing Awards LM box logo.
 *
 * Usage:
 *   <Logo variant="white" />   — white marks on transparent (for dark backgrounds)
 *   <Logo variant="brand" />   — brand blue marks on transparent (for light backgrounds)
 *
 * When the actual logo PNG is available at /images/logo-white.png, the <img> path
 * below can be uncommented and the SVG removed.
 */

interface LogoProps {
  variant?: 'white' | 'brand'
  /** Controls overall rendered width. Height scales proportionally. */
  width?: number
  className?: string
}

export default function Logo({ variant = 'white', width = 220, className = '' }: LogoProps) {
  const fill = variant === 'white' ? '#ffffff' : '#1558ba'
  // SVG viewBox is 260 × 68 — width:height ≈ 3.82:1
  const height = Math.round(width / 3.82)

  return (
    <svg
      viewBox="0 0 260 68"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Lincolnshire Marketing Awards"
      className={className}
    >
      {/* ── Box outline ── */}
      <rect
        x="1"
        y="1"
        width="64"
        height="64"
        stroke={fill}
        strokeWidth="2.5"
        fill="none"
      />

      {/* ── LM monogram ── */}
      <text
        x="33"
        y="46"
        textAnchor="middle"
        fontFamily="Georgia, 'Palatino Linotype', 'Book Antiqua', Palatino, serif"
        fontSize="30"
        fontWeight="700"
        fill={fill}
      >
        LM
      </text>

      {/* ── LINCOLNSHIRE MARKETING ── */}
      <text
        x="80"
        y="30"
        fontFamily="Poppins, 'Helvetica Neue', Arial, sans-serif"
        fontSize="9"
        fontWeight="600"
        letterSpacing="3"
        fill={fill}
      >
        LINCOLNSHIRE MARKETING
      </text>

      {/* ── AWARDS ── */}
      <text
        x="80"
        y="48"
        fontFamily="Poppins, 'Helvetica Neue', Arial, sans-serif"
        fontSize="9"
        fontWeight="600"
        letterSpacing="3"
        fill={fill}
      >
        AWARDS
      </text>
    </svg>
  )
}
