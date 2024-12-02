export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trial';

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  price_id?: string;
  current_period_start?: Date;
  current_period_end?: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

export const SUBSCRIPTION_PRICE = 4.99;
export const SUBSCRIPTION_PRICE_ID = 'price_monthly_499'; // You'll get this from Stripe
