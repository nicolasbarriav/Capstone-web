import type { ApiProfile } from '../../users/getProfile';
import type { Remainder } from './remainder';
import type { Status } from './status';

export class Ticket {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public internalComment: string,
    public currency: string,
    public amount: number,
    public status: string | undefined,
    public debtorName: string,
    public statuses: Status[],
    public remainders: Remainder[],
    public paymentDueAt: Date,
    public createdAt: Date,
    public creditor?: ApiProfile,
    public currentStatus?: string,
    public debtorId?: number | undefined
  ) {}
}
