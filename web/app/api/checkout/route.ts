import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with fallback for build environments
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16' as any, // Using type casting to avoid TS errors on older version types if they mismatch
})

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin') || process.env.ADMIN_ORIGIN || 'http://localhost:3000'

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Solo Stack Method Subscription',
              description: 'Access to execution prompts, audit score, and prompt history.',
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
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Error creating Stripe checkout session:', err)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
