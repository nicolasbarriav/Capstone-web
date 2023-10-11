import type { Remainder } from '../domain/remainder';
import { Ticket } from '../domain/ticket';
import type { ApiSingleTicket } from '../getTicketById';

export default class SingleTicketAdapter {
  static toDomain(response: ApiSingleTicket): Ticket {
    const statuses =
      response.ticket_statuses.map((status) => ({
        id: status.id,
        status: status.status,
        createdAt: new Date(status.created_at),
      })) || [];
    const remainders: Remainder[] =
      response.remainders?.map((remainder) => {
        if (typeof remainder.remainder_date !== 'undefined') {
          const [year, month, day] = remainder.remainder_date.split('-');
          const notificationDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
          );

          return {
            id: remainder.id,
            type: remainder.type,
            status: remainder.sent ? 'sent' : 'not sent',
            sent: remainder.sent,
            notificationDate,
          };
        }
        return {
          id: remainder.id,
          type: remainder.type,
          status: remainder.sent ? 'sent' : 'not sent',
          sent: remainder.sent,
          notificationDate: new Date(), // You can provide a default date here or handle it based on your use case.
        };
      }) || [];

    // Type guard and date parsing for response.payment_due_date
    let paymentDueDate: Date;
    if (typeof response.payment_due_date !== 'undefined') {
      const [year, month, day] = response.payment_due_date.split('-');
      paymentDueDate = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      paymentDueDate = new Date(); // Provide a default date or handle it based on your use case.
    }

    return new Ticket(
      response.id,
      response.title,
      response.description,
      response.internal_comment,
      response.currency,
      response.amount,
      response.ticket_statuses?.[0]?.status,
      response.debtor?.name || '',
      statuses,
      remainders,
      paymentDueDate,
      new Date(response.created_at)
    );
  }
}
