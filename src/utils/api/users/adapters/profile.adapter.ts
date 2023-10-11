import { Profile } from '../domain/profile';
import type { ApiProfile } from '../getProfile';
import { BankAccountAdapter } from './bank_account.adapter';

export class ProfileAdapter {
  static toDomain(response: ApiProfile) {
    const bankAccounts =
      response.bank_accounts?.map((account) =>
        BankAccountAdapter.toDomain(account)
      ) || [];
    return new Profile(
      response.id,
      response.first_name,
      response.last_name,
      response.phone,
      response.email,
      response.admin,
      response.statusCode,
      bankAccounts
    );
  }
}
