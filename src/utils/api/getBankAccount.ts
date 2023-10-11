export interface BankAccount {
  account_number: string;
  account_type: string;
  bank_brand: string;
  client_id: string;
  created_at: string;
  full_name: string;
  id: number;
  mail: string;
  holder_identifier: string;
}

export default async function getBankAcount(
  accessToken: string | null
): Promise<BankAccount> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bank-account` ||
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
