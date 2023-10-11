export enum FrecuencyEnum {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  annually = 'annually',
  quarterly = 'quarterly',
  biannually = 'biannually',
  triannually = 'triannually',
}

export enum CurrencyEnum {
  CLP = 'CLP',
  UF = 'UF',
  USD = 'USD',
}

export class Subscription {
  constructor(
    public id: number,
    public startDate: Date,
    public debtorName: string,
    public planId: number,
    public title: string,
    public description: string,
    public currency: string,
    public amount: number,
    public totalCycles: number,
    public remainingCycles: number,
    public frecuency: string,
    public status: string,
    public createdAt: Date
  ) {}
}
