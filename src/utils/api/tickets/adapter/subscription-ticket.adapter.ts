import { Ticket } from '../domain/ticket';
import type { ApiSubscriptionTicket } from '../getTicketsBySubscription';

export default class SubscriptionTicketAdapter {
  static toDomain(data: ApiSubscriptionTicket): Ticket {
    return new Ticket(
      data.id,
      data.title,
      data.description,
      '',
      data.currency,
      data.amount,
      data.ticket_status?.[0]?.debtor_status,
      data.debtor?.name || '',
      data.ticket_status?.map((status) => ({
        id: status.id,
        status: status.debtor_status,
        createdAt: new Date(status.created_at),
      })) || [],
      [],
      new Date(data.payment_due_date),
      new Date(data.created_at),
      data.creditor
    );
  }
}
