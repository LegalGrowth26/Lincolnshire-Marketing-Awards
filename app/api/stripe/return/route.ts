import { NextResponse, type NextRequest } from 'next/server'
import { stripe, recordPaidSession } from '@/lib/orders'
import { siteUrl } from '@/lib/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Stripe payment links redirect here after payment:
 *   /api/stripe/return?session_id={CHECKOUT_SESSION_ID}
 * The session's client_reference_id carries the pending order's id from the
 * details-first /book flow; a session without one (someone paying on a raw
 * payment link) falls back to creating the order from the session.
 * The details_token is only ever read from our own database and put in the
 * redirect path — it never appears in a Stripe URL parameter.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const base = siteUrl()
  if (!sessionId) return NextResponse.redirect(`${base}/booking/pending`)

  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })
    if (session.payment_status === 'paid') {
      const recorded = await recordPaidSession(session)
      if (recorded) {
        return NextResponse.redirect(`${base}/booking/${recorded.order.details_token}`)
      }
      // Paid, but not through one of our links and with no matching order —
      // nothing to record, nothing to show.
    }
  } catch (e) {
    console.error('[stripe return] failed', sessionId, e)
  }

  return NextResponse.redirect(`${base}/booking/pending`)
}
