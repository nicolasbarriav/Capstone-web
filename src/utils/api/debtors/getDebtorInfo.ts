export interface Debtor {
  id: number;
  name: string;
  government_id: string;
  phone: string;
  email: string;
  is_company: boolean;
}

export default async function getDebtorInfo(
  accessToken: string | null,
  id: string
): Promise<Debtor> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/debtor/${id}` ||
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
