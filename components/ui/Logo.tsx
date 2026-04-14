type LogoProps = {
  className?: string
}

/**
 * Mission Business 2026 wordmark.
 * Swap the square glyph + wordmark for an <Image/> element once the real
 * logo file is supplied at /public/images/logo.svg (or similar).
 */
export default function Logo({ className = '' }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="Mission Business 2026"
    >
      <span
        aria-hidden="true"
        className="grid place-items-center h-8 w-8 rounded-md bg-mb-500 text-black font-bold text-sm"
      >
        MB
      </span>
      <span className="leading-none">
        <span className="block font-semibold text-white tracking-tight">
          Mission Business
        </span>
        <span className="block text-[10px] font-semibold tracking-[0.22em] text-mb-500 mt-1">
          2026
        </span>
      </span>
    </span>
  )
}
