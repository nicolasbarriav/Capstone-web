type JsonRequest = {
  status?: string;
  deleted?: boolean;
};

export default async function changeSubscriptionState(
  subscriptionId: number | undefined,
  accessToken: string | null,
  status?: string,
  deleted?: boolean
) {
  const jsonBody: JsonRequest = {};
  if (status) {
    jsonBody.status = status;
  }
  if (deleted) {
    jsonBody.deleted = true;
  }
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/${subscriptionId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(jsonBody),
    }
  );
  return data;
}
