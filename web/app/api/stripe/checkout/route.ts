import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/server';

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // In a real application, you would pass the price ID from the client or define it in env vars
    // For this implementation, we use a test mode price ID or a fallback
    const priceId = process.env.STRIPE_PRICE_ID || 'price_test_placeholder';

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 });
  }
}
