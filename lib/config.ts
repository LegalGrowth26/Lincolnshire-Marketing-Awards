import 'server-only'
import { sql } from './db'

export type Settings = {
  event_date: string
  venue: string
  arrival_time: string
  dress_code: string
  capacity_seats: number
  automation_enabled: boolean
  invite_reminder_days: number[]
  details_chase_days: number[]
  plan_email_days_before: number
  /** Ticket prices in pence, ex VAT. */
  ticket_price_single: number
  ticket_price_table8: number
}

const DEFAULTS: Settings = {
  event_date: '2026-09-10',
  venue: 'DoubleTree by Hilton, Lincoln',
  arrival_time: '7:00pm',
  dress_code: 'Black tie',
  capacity_seats: 200,
  automation_enabled: false,
  invite_reminder_days: [5, 12, 21],
  details_chase_days: [3, 10, 21],
  plan_email_days_before: 7,
  ticket_price_single: 9900, // £99 + VAT
  ticket_price_table8: 69900, // £699 + VAT
}

export async function getSettings(): Promise<Settings> {
  // Must never throw: public pages fall back to DEFAULTS when the database
  // is unreachable or DATABASE_URL is missing.
  try {
    const data = await sql`select key, value from settings`
    const out: Record<string, unknown> = { ...DEFAULTS }
    for (const row of data) out[row.key] = row.value
    // Prices must always be usable numbers; fall back on anything malformed.
    for (const key of ['ticket_price_single', 'ticket_price_table8'] as const) {
      const n = Number(out[key])
      out[key] = Number.isFinite(n) && n > 0 ? n : DEFAULTS[key]
    }
    return out as Settings
  } catch {
    return { ...DEFAULTS }
  }
}

export async function setSetting(key: string, value: unknown) {
  return sql`
    insert into settings (key, value, updated_at)
    values (${key}, ${JSON.stringify(value)}::jsonb, ${new Date().toISOString()})
    on conflict (key) do update
      set value = excluded.value, updated_at = excluded.updated_at`
}

export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const ticketUrls = () => ({
  single: process.env.TICKET_URL_SINGLE || 'https://buy.stripe.com/cNi8wQ3gBdRl0S38pwgA80c',
  table8: process.env.TICKET_URL_TABLE8 || 'https://buy.stripe.com/4gM4gA4kF5kP58j218gA80d',
})

/** "10 September 2026" */
export function formatEventDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function poundsFromPence(pence: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(
    (pence || 0) / 100,
  )
}

/** "£99" for whole pounds, "£87.38" otherwise. For displayed ticket prices. */
export function priceDisplay(pence: number) {
  const pounds = (pence || 0) / 100
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: Number.isInteger(pounds) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(pounds)
}

/** Per-person pence for a table of 8, rounded to the nearest penny. */
export function tablePerPersonPence(tablePence: number) {
  return Math.round((tablePence || 0) / 8)
}

/** Whole days from today (UTC) to the event. Negative once it has passed. */
export function daysUntil(iso: string) {
  const now = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate(),
  )
  const then = new Date(`${iso}T00:00:00Z`).getTime()
  return Math.round((then - now) / 86_400_000)
}
