import { Subscription } from '../domain/subscription';
import type { ApiSubscription } from '../getSubscriptionInfo';

export class SubscriptionAdapter {
  static toDomain(data: ApiSubscription): Subscription {
    return new Subscription(
      data.id,
      new Date(data.start_date),
      data.debtor.name,
      -1,
      data.title,
      data.description,
      data.currency,
      data.amount,
      data.total_cycles,
      data.remaining_cycles,
      data.frecuency,
      data.status,
      new Date(data.created_at)
    );
  }
}
