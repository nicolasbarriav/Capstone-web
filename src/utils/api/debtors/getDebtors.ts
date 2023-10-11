export interface Debtor {
  id: number;
  name: string;
  government_id: string;
  phone: string;
  email: string;
  is_company: boolean;
}

export default async function getDebtors(
  accessToken: string | null
): Promise<Debtor[]> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/debtor` || 'http://localhost:3000',
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
