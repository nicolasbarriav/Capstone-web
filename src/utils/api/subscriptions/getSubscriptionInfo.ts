import type { Debtor } from '../debtors/getDebtors';
import { SubscriptionAdapter } from './adapters/subscription.adapter';
import type { Subscription } from './domain/subscription';

export interface ApiSubscription {
  id: number;
  debtor: Debtor;
  created_at: string;
  discount: number;
  status: string;
  start_date: string;
  total_cycles: number;
  remaining_cycles: number;
  payment_timing_preference_id: number;
  title: string;
  description: string;
  amount: number;
  currency: string;
  frecuency: string;
}

export default async function getSubscriptionInfo(
  accessToken: string | null,
  subscriptionId: string
): Promise<Subscription> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/${subscriptionId}` ||
      'http://localhost:3000',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return SubscriptionAdapter.toDomain(await data.json());
}
