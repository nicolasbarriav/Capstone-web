export default async function deleteSubscription(
  subscriptionId: number | undefined,
  accessToken: string | null
) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/${subscriptionId}`,
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
