import { ProfileAdapter } from '../adapters/profile.adapter';
import type { Profile } from '../domain/profile';

export type ApiBankAccount = {
  id: number;
  full_name: string;
  holder_identifier: string;
  bank_brand: string;
  account_type: string;
  account_number: string;
  mail: string;
  client_id: string;
  created_at: string;
};

export type ApiProfile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  admin: boolean;
  statusCode?: string;
  bank_accounts?: ApiBankAccount[];
};

export default async function getProfileQuery(
  accessToken: string | null
): Promise<Profile> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`;

  const data = await fetch(url || 'http://localhost:3000', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const res = (await data.json()) as ApiProfile;

  return ProfileAdapter.toDomain(res);
}
