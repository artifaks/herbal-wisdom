-- Create subscription status type
CREATE TYPE public.subscription_status AS ENUM (
    'active',
    'canceled',
    'past_due',
    'unpaid',
    'trial'
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    status subscription_status NOT NULL DEFAULT 'trial',
    price_id TEXT,  -- Stripe price ID
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscription"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Function to check if a user has an active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.subscriptions
        WHERE user_id = $1
        AND status IN ('active', 'trial')
        AND (current_period_end > NOW() OR current_period_end IS NULL)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add subscription_id to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id);

-- Grant necessary permissions
GRANT ALL ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
