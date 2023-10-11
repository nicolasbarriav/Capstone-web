import type { BankAccount } from './bank_account';

export class Profile {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public email: string,
    public admin: boolean,
    public statusCode?: string,
    public bank_accounts?: BankAccount[]
  ) {}
}
