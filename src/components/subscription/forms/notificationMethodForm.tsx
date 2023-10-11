import type { ChangeEvent } from 'react';
import type { ZodIssue } from 'zod';

import type { Debtor } from '@/utils/api/debtors/getDebtorInfo';
import { FormWrapper } from '@/components/create-one-time/FormWrapper';
import SwitchComponent from '@/components/shared/forms/switchComponent';

type NotificationData = {
  notification_method: string;
  notify_before: boolean;
  email: string;
  phone: string;
  debtor_id: number;
  save_template: boolean;
  debtors: Debtor[] | undefined;
  errors: Record<string, '' | ZodIssue>;
};

type NotificationFormProps = NotificationData & {
  updateFields: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
};

export function NotificationMethodForm({
  notify_before,
  updateFields,
  save_template,
  email,
  phone,
  notification_method,
  debtor_id,
  debtors,
}: NotificationFormProps) {
  const getDebtorById = (id: number) => {
    return debtors?.find((debtor) => debtor.id === id);
  };

  const relevantDebtor = getDebtorById(debtor_id);

  const hasEmail =
    email.length > 2 || (relevantDebtor && relevantDebtor.email.length > 2);
  const hasPhone =
    phone.length > 2 || (relevantDebtor && relevantDebtor.phone.length > 2);

  const notificationsMethods = [
    ...(hasEmail ? [{ title: 'Mail', value: 'email' }] : []),
    ...(hasPhone ? [{ title: 'Whatsapp', value: 'whatsapp' }] : []),
    ...(hasEmail && hasPhone
      ? [{ title: 'Ambas', value: 'whatsapp and email' }]
      : []),
  ];

  return (
    <FormWrapper title="¿Cómo quieres que notifiquemos el cobro? 📞📤">
      <div className="px-4 py-6 sm:gap-4 sm:px-6">
        <div className="justify-center space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {notificationsMethods.map((notification_methodAux) => (
            <div
              key={notification_methodAux.value}
              className="flex items-center"
            >
              <input
                id={notification_methodAux.value}
                name="notification-method"
                type="radio"
                checked={notification_methodAux.value === notification_method}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                onChange={(e) =>
                  updateFields({
                    target: {
                      name: 'notification_method',
                      value: e.target.id,
                    },
                  } as any)
                }
              />
              <label
                htmlFor={notification_methodAux.value}
                className="ml-3 block text-sm font-medium leading-6 text-gray-900"
              >
                {notification_methodAux.title}
              </label>
            </div>
          ))}
        </div>
        <p className="justify-center px-4 text-center text-xs">
          *por defecto notificaremos el mismo día de la fecha de pago
        </p>
      </div>

      <>
        <div className="px-4 py-6 sm:gap-4 sm:px-6">
          <div className="justify-center space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            <p className="px-4 text-sm">
              ¿Quieres que le enviemos un recordatorio antes del pago?
            </p>
            <SwitchComponent
              checked={notify_before}
              onChange={(e) =>
                updateFields({
                  target: {
                    name: 'notify_before',
                    value: e,
                  },
                } as any)
              }
            />
          </div>
        </div>
      </>
      <>
        <div className="px-4 py-6 sm:gap-4 sm:px-6">
          <div className="justify-center space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            <p className="px-4 text-sm">
              ¿Quieres guardar esta ticket para usar como plantilla en el
              futuro?
            </p>
            <SwitchComponent
              checked={save_template}
              onChange={(e) =>
                updateFields({
                  target: {
                    name: 'save_template',
                    value: e,
                  },
                } as any)
              }
            />
          </div>
        </div>
      </>
    </FormWrapper>
  );
}
