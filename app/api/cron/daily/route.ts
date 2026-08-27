import { NextResponse, type NextRequest } from 'next/server'
import { runDailyJobs } from '@/lib/jobs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Single daily pass. Vercel Hobby allows one cron run per day with up to an
 * hour of timing slop, so everything lives in one job. Works unchanged on Pro.
 * Vercel sends `Authorization: Bearer $CRON_SECRET` automatically when the
 * env var is set.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'CRON_SECRET not set' }, { status: 500 })

  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const force = req.nextUrl.searchParams.get('force') === '1'
  const report = await runDailyJobs(force)
  return NextResponse.json(report)
}
