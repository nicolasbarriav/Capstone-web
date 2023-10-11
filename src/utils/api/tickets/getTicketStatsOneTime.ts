export interface TicketStats {
  name: string;
  value: number;
  change: number;
  change_type: string;
}

export default async function getTicketStatsOneTime(
  accessToken: string | null,
  debtorId?: string
): Promise<TicketStats[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/one-time/stats`;
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

  return data.json();
}
