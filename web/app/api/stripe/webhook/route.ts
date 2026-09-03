import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new NextResponse('No signature provided', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_placeholder'
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // Here you would typically update the user's subscription status in your database
      console.log('Checkout session completed:', session.id);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      // Handle subscription cancellation
      console.log('Subscription deleted:', subscription.id);
      break;
    }
    // Add other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
