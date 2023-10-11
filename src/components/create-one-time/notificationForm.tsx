import { Switch } from '@headlessui/react';
import { add, isSunday, sub } from 'date-fns';
import type { ChangeEvent } from 'react';
import type { ZodIssue } from 'zod';

import type { Debtor } from '@/utils/api/debtors/getDebtorInfo';
import classNames from '@/utils/functions/classNames';

import { FormWrapper } from './FormWrapper';

type NotificationData = {
  notification_method: string;
  notify_before: boolean;
  payment_due_date: string;
  email: string;
  phone: string;
  debtor_id: number;
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

export function NotificationForm({
  notification_method,
  notify_before,
  updateFields,
  payment_due_date,
  email,
  phone,
  debtor_id,
  debtors,
}: NotificationFormProps) {
  const getDebtorById = (id: number) => {
    return debtors?.find((debtor) => debtor.id === id);
  };

  const getRemainingDays = () => {
    const currentDate = new Date();
    const paymentDate = new Date(payment_due_date);
    const timeDifference = paymentDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const remainingDays = getRemainingDays() - 1;
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

  const handleRemainderDueDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const paymentDueDate = payment_due_date;
    let selectedDateValue = sub(new Date(paymentDueDate), {
      days: parseInt(e.target.value, 10),
    });

    if (selectedDateValue) {
      if (isSunday(selectedDateValue)) {
        selectedDateValue = add(selectedDateValue, { days: 1 });
      }
    }

    updateFields({
      target: {
        name: 'notify_before_day',
        value: selectedDateValue.toISOString().split('T')[0] || '',
      },
    } as any);
  };

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
      {remainingDays > 0 && (
        <>
          <div className="px-4 py-6 sm:gap-4 sm:px-6">
            <div className="justify-center space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
              <p className="px-4 text-sm">
                ¿Quieres que le enviemos un recordatorio antes del pago?
              </p>
              <Switch
                checked={notify_before}
                onChange={(e) =>
                  updateFields({
                    target: {
                      name: 'notify_before',
                      value: e,
                    },
                  } as any)
                }
                className={classNames(
                  notify_before ? 'bg-indigo-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  className={classNames(
                    notify_before ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  )}
                >
                  <span
                    className={classNames(
                      notify_before
                        ? 'opacity-0 duration-100 ease-out'
                        : 'opacity-100 duration-200 ease-in',
                      'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                    )}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={classNames(
                      notify_before
                        ? 'opacity-100 duration-200 ease-in'
                        : 'opacity-0 duration-100 ease-out',
                      'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                    )}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </Switch>
            </div>
          </div>
          <div className="px-4 py-6 sm:gap-4 sm:px-6">
            <div className="justify-center space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
              {notify_before ? (
                <div>
                  <p className="px-4 text-sm">¿Cuántos días antes?</p>
                  <input
                    type="number"
                    id="notify-date"
                    min={1}
                    max={remainingDays}
                    required
                    className="min-w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    onChange={handleRemainderDueDateChange}
                  />
                  <p className="text-xs">*no podemos notificar los domingos</p>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </FormWrapper>
  );
}
