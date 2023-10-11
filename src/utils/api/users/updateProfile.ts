interface Form {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export default async function updateProfile(
  form: Form,
  accessToken: string | null
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
    method: 'PUT',
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

  return data;
}
