export default async function createTicketState(
  ticketId: number | undefined,
  status: string,
  accessToken: string | null
) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/${ticketId}/status`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ticket_id: ticketId,
        debtor_status: status,
      }),
    }
  );

  return data;
}
