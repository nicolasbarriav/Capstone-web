export type OneTimeTicketForm = {
  ticket_name: string;
  ticket_description?: string;
  amount: string;
  currency: string;
  payment_due_date: string;
  debtor_exists: boolean;
  is_company: boolean;
  debtor_name: string;
  government_id?: string;
  phone: string;
  email: string;
  notification_method: string;
  notify_before: boolean;
  notify_before_day?: string;
};
