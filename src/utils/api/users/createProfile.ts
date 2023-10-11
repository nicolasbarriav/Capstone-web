import getProfile from './getProfile';

interface Form {
  first_name: string;
  last_name: string;
  phone: string;
  full_name: string;
  holder_identifier: string;
  bank_brand: string;
  account_type: string;
  account_number: string;
  email: string;
  bank_email: string;
}

export default async function createProfile(
  form: Form,
  accessToken: string | null
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(form),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  getProfile(accessToken);

  return data;
}
