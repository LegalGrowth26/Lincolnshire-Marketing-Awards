import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { stripe, upsertOrderFromSession } from '@/lib/orders'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  // Raw body is required for signature verification. Do not parse first.
  const raw = await req.text()

  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'checkout.session.async_payment_succeeded'
  ) {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Delayed payment methods land as completed but unpaid. Wait for the
  // async_payment_succeeded event instead of holding a seat for nothing.
  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true, skipped: 'unpaid' })
  }

  try {
    await upsertOrderFromSession(session)
  } catch (e) {
    console.error('[stripe webhook] failed to record order', session.id, e)
    // 500 tells Stripe to retry, which is what we want if the database was down.
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
