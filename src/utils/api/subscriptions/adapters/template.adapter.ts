import Template from '../domain/template';
import type { ApiTemplate } from '../queries/getTemplates';

export class TemplateAdapter {
  static toDomain(data: ApiTemplate): Template {
    return new Template(
      data.id,
      data.title,
      data.description,
      new Date(data.start_date),
      data.total_cycles,
      data.frecuency,
      data.amount,
      data.currency,
      data.remainder_type,
      data.remainder_before_payment,
      data.payment_timing_preference_id
    );
  }
}
