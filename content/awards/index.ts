// Every awards year, newest first. Adding LMA 2027 next September is one new
// file (content/awards/2027.ts) plus one entry in the array below.

import { AWARDS_2026 } from './2026'

export type AwardCategory = {
  title: string
  shortlist: string[]
  winner: string
  highlyCommended: string
}

export type AwardSupporter = {
  name: string
  role: string
  /** Path under public/, e.g. '/sponsors/allen-signs.png'. Name plate until the file exists. */
  logo: string
}

export type AwardYear = {
  year: number
  label: string
  eventDate: string
  venue: string
  supporters: AwardSupporter[]
  categories: AwardCategory[]
}

export const AWARD_YEARS: AwardYear[] = [AWARDS_2026].sort((a, b) => b.year - a.year)

export const latestAwardYear = (): AwardYear => AWARD_YEARS[0]

export function getAwardYear(year: number): AwardYear | undefined {
  return AWARD_YEARS.find((y) => y.year === year)
}
