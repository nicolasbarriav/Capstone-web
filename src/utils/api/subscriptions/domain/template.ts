import type { CurrencyEnum, FrecuencyEnum } from './subscription';

export default class Template {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly startDate: Date,
    public readonly totalCycles: number,
    public readonly frecuency: FrecuencyEnum,
    public readonly amount: number,
    public readonly currency: CurrencyEnum,
    public readonly remainderType: string,
    public readonly remainderBeforePayment: boolean,
    public readonly paymentTimingPreferenceId: number
  ) {}
}
