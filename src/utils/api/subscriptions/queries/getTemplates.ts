import { TemplateAdapter } from '../adapters/template.adapter';
import type { CurrencyEnum, FrecuencyEnum } from '../domain/subscription';
import type Template from '../domain/template';

export type ApiTemplate = {
  id: number;
  title: string;
  description: string;
  client_id: string;
  start_date: string;
  total_cycles: number;
  frecuency: FrecuencyEnum;
  amount: number;
  currency: CurrencyEnum;
  remainder_type: string;
  remainder_before_payment: boolean;
  payment_timing_preference_id: number;
};

export default function getTemplates(
  accessToken: string | null
): Promise<Template[]> {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/template`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((res) =>
      res.map((template: ApiTemplate) => {
        return TemplateAdapter.toDomain(template);
      })
    );
}
