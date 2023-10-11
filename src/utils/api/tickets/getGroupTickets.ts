import type { Debtor } from '../debtors/getDebtorInfo';
import type { ApiProfile } from '../users/getProfile';
import { GroupTicketAdapter } from './adapter/group-tickets.adapter';
import type { Ticket } from './domain/ticket';

interface Status {
  id: number;
  ticket_id: number;
  debtor_status: string;
  vambe_status: string;
  created_at: string;
  deleted: boolean;
}
export interface ApiGroupTicket {
  id: number;
  title: string;
  description: string;
  debtor_id: number;
  creditor_id: string;
  created_at: string;
  payment_due_date: string;
  currency: string;
  amount: number;
  deleted: boolean;
  current_status: string;
  debtor: Debtor;
  ticket_status: Status[];
  creditor: ApiProfile;
  remainders?: {
    id: number;
    remainder_date: string;
    type: string;
    sent: boolean;
  };
}

export default async function getGroupTickets(
  accessToken: string | null,
  debtorId?: number | undefined,
  _getTickets?: boolean | undefined
): Promise<Ticket[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/grouped`;

  if (debtorId) {
    url += `?debtor=${debtorId}`;
  }

  const data = await fetch(url || 'http://localhost:3000', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  
  return data
    .json()
    .then((response: ApiGroupTicket[]) =>
      response.map((ticket) => GroupTicketAdapter.toDomain(ticket))
    );
}
