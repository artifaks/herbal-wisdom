import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Subscription, SUBSCRIPTION_PRICE } from '@/types/subscription';

export default function SubscriptionManager() {
  const { user } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      // Here you would integrate with your payment processor (e.g., Stripe)
      // For now, we'll just create a trial subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_id: user?.id,
            status: 'trial',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Subscription Status</h2>
      
      {subscription ? (
        <div>
          <p className="mb-2">Status: <span className="capitalize">{subscription.status}</span></p>
          {subscription.current_period_end && (
            <p className="mb-2">
              Valid until: {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}
          {subscription.status === 'trial' && (
            <div className="mt-4">
              <p className="mb-2">Your trial will end soon. Subscribe to continue access.</p>
              <button
                onClick={handleSubscribe}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Subscribe for ${SUBSCRIPTION_PRICE}/month
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-4">Subscribe to access premium features</p>
          <button
            onClick={handleSubscribe}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Start Free Trial
          </button>
        </div>
      )}
    </div>
  );
}
