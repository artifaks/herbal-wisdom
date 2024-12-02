import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

async function updateSubscriptionStatus(userId: string, status: 'active' | 'canceled') {
  const supabase = createRouteHandlerClient({ cookies })
  
  await supabase
    .from('profiles')
    .update({ subscription_status: status })
    .eq('id', userId)
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  switch (event.type) {
    case 'checkout.session.completed':
      if (session.metadata?.userId) {
        await updateSubscriptionStatus(session.metadata.userId, 'active')
      }
      break
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      
      // Get the user ID from the customer's metadata
      const customer = await stripe.customers.retrieve(customerId)
      if (customer.metadata?.userId) {
        await updateSubscriptionStatus(customer.metadata.userId, 'canceled')
      }
      break
  }

  return new NextResponse(null, { status: 200 })
}
