import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with the secret key, using a fallback for build time
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia' as any, // Cast to any to avoid type error with specific version string
})

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Assuming we want a subscription, create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Solo Stack Method™ Subscription',
              description: 'Access to all features ($20/month)',
            },
            unit_amount: 2000, // $20.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/signup`,
      customer_email: email,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'An error occurred during checkout' },
      { status: 500 }
    )
  }
}
