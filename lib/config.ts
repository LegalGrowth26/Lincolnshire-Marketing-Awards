import 'server-only'
import { db } from './supabase'

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
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await db().from('settings').select('key, value')
  if (error || !data) return { ...DEFAULTS }
  const out: Record<string, unknown> = { ...DEFAULTS }
  for (const row of data) out[row.key] = row.value
  return out as Settings
}

export async function setSetting(key: string, value: unknown) {
  return db()
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
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
