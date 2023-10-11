interface Form {
  title: string;
  description: string;
  amount: number;
  currency: string;
  frecuency: string;
  start_date: string;
  payment_timing_preference_id: number;
  total_cycles: number;
  debtor_exists: boolean;
  is_company: boolean;
  debtor_name: string;
  government_id: string;
  debtor_id: number;
  phone: string;
  email: string;
  notification_method: string;
  notify_before: boolean;
  save_template: boolean;
}

export default async function createSubscription(
  form: Form,
  accessToken: string | null
) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription` ||
      'http://localhost:3000',
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
