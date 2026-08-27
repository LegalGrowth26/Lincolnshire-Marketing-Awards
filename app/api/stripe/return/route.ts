import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/supabase'
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

  const supabase = db()

  for (let i = 0; i < 5; i++) {
    const { data } = await supabase
      .from('orders')
      .select('details_token')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()
    if (data?.details_token) {
      return NextResponse.redirect(`${base}/booking/${data.details_token}`)
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
