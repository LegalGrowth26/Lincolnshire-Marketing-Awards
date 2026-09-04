// The 2026 judging panel. Names only for now — role and organisation are
// PLACEHOLDERS awaiting the real details, deliberately not invented.
// Nothing here says who judged which category, and never will: names and
// roles only, per docs/CONFIDENTIAL.md.

export type Judge = {
  name: string
  /** Role and organisation to be supplied — leave undefined until confirmed. */
  role?: string
  organisation?: string
}

export const judges: Judge[] = [
  { name: 'Dominick McOmish' },
  { name: 'Dr Islam Gouda' },
  { name: 'Hannah Westropp' },
  { name: 'Stuart Burlton' },
  { name: 'Kajal RadheKrishna Pandey' },
  { name: 'Emma Watson' },
  { name: 'Callum Parker' },
  { name: 'Andy Nisevic' },
  { name: 'Elsie Greenjordan' },
]
