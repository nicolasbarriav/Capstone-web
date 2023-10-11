interface Ticket {
  date: string;
  amount: string;
  status:
    | 'paid'
    | 'settled'
    | 'manually_paid'
    | 'generated'
    | 'available'
    | 'expired'
    | 'canceled';
}

export interface DebtorTicket {
  id: number;
  name: string;
  last_ticket: Ticket;
}

export default async function getThreeLastDebtorsOneTime(
  accessToken: string | null
): Promise<DebtorTicket[]> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/top-debtors-one-time` ||
      'http://localhost:3000',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data.json();
}
