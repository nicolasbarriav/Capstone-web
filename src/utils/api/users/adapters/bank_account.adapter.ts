import { BankAccount } from '../domain/bank_account';
import type { ApiBankAccount } from '../getProfile';

export class BankAccountAdapter {
  static toDomain(res: ApiBankAccount) {
    return new BankAccount(
      res.full_name,
      res.holder_identifier,
      res.bank_brand,
      res.account_type,
      res.account_number,
      res.mail
    );
  }
}
