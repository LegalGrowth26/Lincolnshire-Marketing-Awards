import { redirect } from 'next/navigation'
import { latestAwardYear } from '@/content/awards'

// Rendered per-request so the redirect is a real HTTP 307 with a Location
// header, not a prerendered meta refresh.
export const dynamic = 'force-dynamic'

// /winners always lands on the most recent year, so the nav link never needs
// changing when a new year is published.
export default function WinnersIndex() {
  redirect(`/winners/${latestAwardYear().year}`)
}
