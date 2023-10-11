import type { OneTimeTicketForm } from 'src/types/forms';

export default async function createTicket(
  form: OneTimeTicketForm,
  accessToken: string | undefined
) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket` || 'http://localhost:3000',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(form),
    }
  );

  return data;
}
