import { z } from 'zod';

export const debtorSchema = z.object({
  debtor_id: z.number(),
  debtor_name: z.string().nonempty('El nombre es requerido'),
  government_id: z.string(),
  phone: z.string(),
  email: z.string().email('El email es requerido'),
  is_company: z.boolean(),
  debtor_exists: z.boolean(),
});

export const refinedDebtorSchema = debtorSchema
  .refine((data) => data.debtor_exists || data.debtor_name.length >= 2, {
    message: 'Este campo es requerido.',
    path: ['debtor_name'],
  })
  .refine(
    (data) =>
      !(data.debtor_exists === false && data.is_company === true) ||
      data.government_id.length >= 2,
    {
      message: 'Ingresa un RUT válido 👮🏽‍♀️',
      path: ['government_id'],
    }
  )
  .refine(
    (data) =>
      !(data.debtor_exists === false) ||
      data.phone ||
      (data.email && z.string().email().safeParse(data.email).success),
    {
      message: 'Tienes que completar el campo de mail o teléfono',
      path: ['email'],
    }
  )
  .refine((data) => !(data.debtor_exists === true) || data.debtor_id > 0, {
    message: '¡Tienes que seleccionar a un cliente!',
    path: ['debtor_id'],
  });

export const subscriptionSchama = z.object({
  title: z.string().nonempty('El nombre es requerido'),
  description: z.string(),
  amount: z
    .string()
    .nonempty('El monto es requerido')
    .regex(
      /^(?:\d{1,3}|(?:\d{1,3}(?:\.\d{3})+))(?:[,]\d+)?$/,
      'El monto tiene que ser numerico'
    ),
  currency: z.string().nonempty('La moneda es requerida'),
  frecuency: z.string().nonempty('La frecuencia es requerida'),
  start_date: z.string().nonempty('La fecha de inicio es requerida'),
  payment_timing_preference_id: z.number(),
  total_cycles: z
    .string()
    .min(1, 'El total de ciclos es requerido')
    .regex(/^\d+$/, 'El total de ciclos debe ser un número'),
});

export const notificationSchema = z.object({
  notification_method: z
    .string()
    .min(1, 'El método de notificación es requerido'),
  notify_before: z.boolean(),
  save_template: z.boolean(),
});
