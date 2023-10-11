import { GroupTicketAdapter } from './adapter/group-tickets.adapter';
import type { Ticket } from './domain/ticket';
import type { ApiGroupTicket } from './getGroupTickets';

export default async function getGroupTickets(
  accessToken: string | null,
  debtorId?: string
): Promise<Ticket[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/one-time/grouped`;

  if (debtorId) {
    url += `&debtor=${debtorId}`;
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
