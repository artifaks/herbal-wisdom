'use client';

import { useState } from 'react';
import { SUBSCRIPTION_PRICE } from '@/types/subscription';
import { getStripe, formatPrice } from '@/lib/stripe';

interface SubscribeButtonProps {
  isLoading?: boolean;
}

export const SubscribeButton = ({ isLoading = false }: SubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Get Stripe instance
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading || isLoading}
      className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors
        ${(loading || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading || isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        `Subscribe for ${formatPrice(SUBSCRIPTION_PRICE)}/month`
      )}
    </button>
  );
};