export default async function deleteTicket(
  ticketId: number | undefined,
  accessToken: string | null
) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/${ticketId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return data;
}
