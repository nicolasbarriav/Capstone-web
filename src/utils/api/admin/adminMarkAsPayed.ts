interface TicketsIds {
  id: number;
  client_id: string;
}

interface TransferData {
  ticket_ids: TicketsIds[];
  amount: number;
  currency: string;
}

export default async function markAsPayed(
  transferData: TransferData,
  accessToken: string | null
) {
  if (!transferData.amount) {
    throw new Error('Amount is not provided.');
  }
  if (!transferData.ticket_ids.length) {
    throw new Error('Ticket IDs are not provided.');
  }

  // Ensure all ticketIds have the same client_id
  const firstClientId = transferData.ticket_ids[0]!.client_id;
  const allSameClient = transferData.ticket_ids.every(
    (ticket) => ticket.client_id === firstClientId
  );

  if (!allSameClient) {
    throw new Error('Not all tickets belong to the same client.');
  }

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/mark-as-paid`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(transferData),
    }
  );
  return data;
}
