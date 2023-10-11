import type { Debtor } from '../debtors/getDebtorInfo';
import SingleTicketAdapter from './adapter/single-ticket.adapter';
import type { Ticket } from './domain/ticket';

export interface ApiRemainder {
  id: number;
  remainder_date: string;
  type: string;
  sent: boolean;
}

export interface ApiStatus {
  id: number;
  status:
    | 'paid'
    | 'settled'
    | 'manually_paid'
    | 'generated'
    | 'available'
    | 'expired'
    | 'canceled';
  created_at: string;
}

export type ApiSingleTicket = {
  id: number;
  title: string;
  description: string;
  debtor: Debtor;
  payment_due_date: string;
  currency: string;
  amount: number;
  ticket_statuses: ApiStatus[];
  remainders: ApiRemainder[];
  created_at: string;
  internal_comment: string;
};

export default async function getTicketById(
  ticket_id: string,
  accessToken: string | null
): Promise<Ticket> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/${ticket_id}` ||
      'http://localhost:3000',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json());

  return SingleTicketAdapter.toDomain(data);
}
