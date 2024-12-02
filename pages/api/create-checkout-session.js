import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (!process.env.STRIPE_PRICE_ID) {
  throw new Error('STRIPE_PRICE_ID is not set in environment variables');
}

// Initialize Stripe with secret key from environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = supabase()
    if (!client) throw new Error('Supabase client not initialized')

    // Get the user token from the request
    const { data: { user }, error: authError } = await client.auth.getUser(req.headers.authorization);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized access', details: authError?.message });
    }

    // Check if user already has an active subscription
    const { data: subscription, error: subError } = await client
      .from('user_subscriptions')
      .select('stripe_customer_id, subscription_status')
      .eq('user_id', user.id)
      .single();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      return res.status(500).json({ error: 'Error checking subscription status' });
    }

    // If user already has an active subscription, prevent double subscription
    if (subscription?.subscription_status === 'active') {
      return res.status(400).json({ error: 'User already has an active subscription' });
    }

    let customerId = subscription?.stripe_customer_id;

    // If no customer ID exists, create a new customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save the customer ID to our database
      const { error: upsertError } = await client
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          subscription_status: 'inactive',
        });

      if (upsertError) {
        console.error('Error saving customer ID:', upsertError);
        return res.status(500).json({ error: 'Error creating customer profile' });
      }
    }

    // Validate price ID exists in Stripe
    try {
      await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID);
    } catch (priceError) {
      console.error('Invalid price ID:', priceError);
      return res.status(400).json({ error: 'Invalid subscription plan' });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/canceled`,
      metadata: {
        user_id: user.id,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Error processing subscription request',
      details: error.message 
    });
  }
}