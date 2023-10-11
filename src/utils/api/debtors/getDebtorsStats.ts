// import { Ticket } from "../tickets/domain/ticket";

export interface DebtorStats {
  id: number;
  name: string;
  last_ticket_date: string;
  total: string;
  paid: string;
  to_due: string;
  expired: string;
  // AGREGAR AL ENDPOINT
  currency?: string;
  risk?: number;
  is_company?: boolean;
}

export default async function getDebtorsStats(
  accessToken: string | null,
  days: string
): Promise<DebtorStats[]> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/debtor/stats?days=${days}` ||
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
