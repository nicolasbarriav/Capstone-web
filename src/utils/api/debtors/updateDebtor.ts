interface Form {
  id: number;
  is_company: boolean;
  name: string;
  government_id?: string;
  phone: string;
  email: string;
}

export default async function updateDebtor(
  form: Form,
  accessToken: string | null
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/debtor/${form.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(form),
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
