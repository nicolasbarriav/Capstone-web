import type { ApiProfile } from '../users/getProfile';
import SubscriptionTicketAdapter from './adapter/subscription-ticket.adapter';
import type { Ticket } from './domain/ticket';

export type ApiSubscriptionTicket = {
  id: number;
  title: string;
  description: string;
  currency: string;
  amount: number;
  payment_due_date: string;
  created_at: string;

  debtor: {
    id: number;
    name: string;
  };
  ticket_status: {
    id: number;
    debtor_status: string;
    created_at: string;
  }[];
  creditor: ApiProfile;
};
export default async function getTicketsBySubscription(
  subscriptionId: string,
  accessToken: string
): Promise<Ticket[]> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/subscription/${subscriptionId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((res: ApiSubscriptionTicket[]) =>
      res.map((d) => SubscriptionTicketAdapter.toDomain(d))
    );
  return data;
}
