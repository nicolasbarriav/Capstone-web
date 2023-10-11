import type { ApiGroupTicket } from '../tickets/getGroupTickets';

interface TransactionTicket {
  ticket_id: number;
  ticket: ApiGroupTicket;
}

export interface Transaction {
  id: number;
  created_at: string;
  amount: number;
  vambe_payment_tickets: TransactionTicket[];
}

export default async function getTransactions(
  accessToken: string
): Promise<Transaction[]> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/vambe-payment`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json());
  return data;
}
