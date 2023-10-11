import type { Remainder } from '../domain/remainder';
import { Ticket } from '../domain/ticket';
import type { ApiGroupTicket } from '../getGroupTickets';

export class GroupTicketAdapter {
  static toDomain(response: ApiGroupTicket): Ticket {
    const statuses =
      response.ticket_status?.map((status) => ({
        id: status.id,
        status: status.debtor_status,
        createdAt: new Date(status.created_at),
      })) || [];
    const remainders: Remainder[] = [];

    return new Ticket(
      response.id,
      response.title,
      response.description,
      '',
      response.currency,
      response.amount,
      response.ticket_status?.[0]?.debtor_status,
      response.debtor?.name || '',
      statuses,
      remainders,
      new Date(response.payment_due_date),
      new Date(response.created_at),
      response.creditor,
      response.current_status,
      response.debtor_id
    );
  }
}
