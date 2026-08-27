import { NextResponse, type NextRequest } from 'next/server'
import { sql } from '@/lib/db'
import { stripe, upsertOrderFromSession } from '@/lib/orders'
import { siteUrl } from '@/lib/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Stripe payment links redirect here after payment:
 *   /api/stripe/return?session_id={CHECKOUT_SESSION_ID}
 * The webhook usually wins the race, but not always, so this falls back to
 * creating the order inline.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const base = siteUrl()
  if (!sessionId) return NextResponse.redirect(`${base}/booking/pending`)

  for (let i = 0; i < 5; i++) {
    try {
      const rows = await sql`
        select details_token from orders where stripe_session_id = ${sessionId}`
      if (rows[0]?.details_token) {
        return NextResponse.redirect(`${base}/booking/${rows[0].details_token}`)
      }
    } catch {
      // keep polling; the Stripe fallback below still runs
    }
    await sleep(400)
  }

  // Webhook has not landed. Build the order from Stripe directly.
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })
    if (session.payment_status === 'paid') {
      const { order } = await upsertOrderFromSession(session)
      return NextResponse.redirect(`${base}/booking/${order.details_token}`)
    }
  } catch (e) {
    console.error('[stripe return] fallback failed', sessionId, e)
  }

  return NextResponse.redirect(`${base}/booking/pending`)
}
