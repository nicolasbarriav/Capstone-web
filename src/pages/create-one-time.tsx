import { add, isSunday } from 'date-fns';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useQuery } from 'react-query';
import type { ZodIssue } from 'zod';
import { z } from 'zod';

import { DebtorForm } from '@/components/create-one-time/debtorForm';
import { NotificationForm } from '@/components/create-one-time/notificationForm';
import { TicketForm } from '@/components/create-one-time/ticketForm';
import NavBar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import useForm from '@/hooks/useForm';
import { useMultistepForm } from '@/hooks/useMultistepForm';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import getDebtors from '@/utils/api/debtors/getDebtors';
import createTicket from '@/utils/api/tickets/createTicket';

import formatRut from '@/utils/functions/formatRut';

import Stepper from '@/components/stepper';
import { useNotification } from '@/context/notificationContext';
import withAuth from '../components/withAuth';

const initialValues = {
  ticket_name: '',
  ticket_description: '',
  internal_comment: '',
  amount: '',
  currency: 'CLP',
  payment_due_date: '',
  debtor_exists: false,
  is_company: true,
  debtor_name: '',
  government_id: '',
  debtor_id: -1,
  phone: '',
  email: '',
  confirm_debtor_existance: false,
  notification_method: 'mail',
  notify_before: false,
  notify_before_day: '',
};

const ticketValidation = z.object({
  ticket_name: z.string().min(1, 'El nombre del ticket es requerido'),
  ticket_description: z.string(),
  amount: z.string().min(1, 'El monto del ticket es requerido'),
  currency: z.string().min(1, 'La moneda del ticket es requerida'),
  payment_due_date: z
    .string()
    .min(1, 'La fecha de vencimiento del ticket es requerida'),
  internal_comment: z.string(),
});

const debtorBase = {
  debtor_exists: z.boolean(),
  is_company: z.boolean(),
  debtor_name: z.string(),
  government_id: z.string(),
  phone: z.string(),
  email: z.string(),
  debtor_id: z.number(),
  confirm_debtor_existance: z.boolean(),
};

const debtorValidation = z.object(debtorBase);

const debtorValidationRefined = z
  .object(debtorBase)
  .refine((data) => data.debtor_exists || data.debtor_name.length >= 2, {
    message: 'Este campo es requerido.',
    path: ['debtor_name'],
  })
  .refine(
    (data) =>
      !(data.debtor_exists === false && data.is_company === true) ||
      data.government_id.length >= 10,
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
  })
  .refine((data) => data.confirm_debtor_existance === false, {
    message: '¡El cliente que quieres agregar ya existe!',
    path: ['confirm_debtor_existance'],
  });

const notificationValidation = z.object({
  notification_method: z
    .string()
    .min(1, 'El método de notificación es requerido'),
  notify_before: z.boolean(),
  notify_before_day: z.string(),
});

type Props = {
  accessToken?: string;
};
const CreateOneTime: React.FC<Props> = ({ accessToken }) => {
  const router = useRouter();
  const { setNotification } = useNotification();

  const { form, setForm, onChange, errors, resetErrors, setErrors } = useForm(
    initialValues,
    z.object({
      ...ticketValidation.shape,
      ...debtorValidation.shape,
      ...notificationValidation.shape,
    })
  );

  const formatNumberWithPoints = (num: string) => {
    const parts = num.split(',');
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return parts.join(',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    let onlyNumsAndComma;
    if (form.currency === 'UF') {
      onlyNumsAndComma = value.replace(/[^0-9,]/g, '');
    } else {
      onlyNumsAndComma = value.replace(/[^0-9]/g, '');
    }

    setForm({ ...form, amount: formatNumberWithPoints(onlyNumsAndComma) });
  };

  const handlePaymentDueDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value) {
      let selectedDate = add(new Date(e.target.value), {
        hours: 4,
      });
      selectedDate = isSunday(selectedDate)
        ? add(selectedDate, { days: 1 })
        : selectedDate;

      e.target.value = String(selectedDate.toISOString().split('T')[0]);
    }

    setForm({
      ...form,
      payment_due_date: e.target.value,
    });
  };

  const handleSwitchChange = (e: boolean) => {
    setForm({ ...form, debtor_exists: e, debtor_id: -1 });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, is_company: e.target.id === 'Empresa' });
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, government_id: formatRut(e.target.value) });
  };
  const handleNotifyMethodChange = (data: string) => {
    setForm({ ...form, notification_method: data });
  };

  const { isLoading: debtorsLoading, data: debtors } = useQuery(
    ['getDebtors', accessToken],
    () => getDebtors(String(accessToken)),
    {
      enabled: !!accessToken,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  const {
    currentStepIndex,
    currentValidation,
    step,
    isFirstStep,
    isLastStep,
    back,
    next,
  } = useMultistepForm(
    [
      <TicketForm
        {...form}
        updateFields={onChange}
        errors={errors}
        handleAmountChange={handleAmountChange}
        handlePaymentDueDateChange={handlePaymentDueDateChange}
        key="1"
      />,
      <DebtorForm
        {...form}
        debtors={debtors}
        updateFields={onChange}
        errors={errors}
        handleCompanyChange={handleCompanyChange}
        handleSwitchChange={handleSwitchChange}
        handleRUTChange={handleRUTChange}
        handleNotifyMethod={handleNotifyMethodChange}
        key="2"
      />,
      <NotificationForm
        {...form}
        debtors={debtors}
        updateFields={onChange}
        errors={errors}
        key="3"
      />,
    ],
    [ticketValidation, debtorValidationRefined, notificationValidation]
  );

  const validateCurrentStep = () => {
    if (!currentValidation) throw new Error('No validation schema found');
    const validation = currentValidation.safeParse(form);
    if (validation.success) {
      return validation;
    }
    const auxErrors = JSON.parse(validation.error.message);
    const newErrors = auxErrors.reduce(
      (acc: Record<string, ZodIssue>, curr: any) => {
        acc[curr.path[0]] = curr;
        return acc;
      },
      {}
    );
    setErrors(newErrors);
    return validation;
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const validationResults = validateCurrentStep();

    if (validationResults.success) {
      if (!isLastStep) {
        next();
        resetErrors();
      } else {
        const response = await createTicket(form, accessToken);
        if (response.status === 201) {
          setNotification({
            message: 'Ticket de pago creado exitosamente',
            color: 'green',
          });
          router.push('/one-time-payment');
        } else {
          setNotification({
            message: 'Error al crear ticket de pago',
            color: 'red',
          });
        }
      }
    }
  }

  return (
    <>
      <Main meta={<Meta title="vambe" description="" />}>
        <NavBar />
        <main className={debtorsLoading ? 'animate-pulse' : ''}>
          <form onSubmit={onSubmit}>
            <div className="mx-auto max-w-xl py-24 sm:py-32 lg:max-w-4xl">
              <div className="mx-auto hidden max-w-xl items-center justify-center sm:flex">
                <Stepper
                  currentStep={currentStepIndex + 1}
                  complete={false}
                  steps={['Ticket', 'Cliente', 'Notificación']}
                ></Stepper>
              </div>
              <div className="m-5 overflow-hidden bg-white shadow-lg sm:rounded-lg">
                {step}
                <div className="flex items-center justify-end space-x-2 p-4">
                  <div className="space-x-2">
                    {!isFirstStep && (
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={back}
                      >
                        Anterior
                      </Button>
                    )}
                    <Button variant="secondary" size="default" type="submit">
                      {isLastStep ? 'Crear' : 'Siguiente'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </Main>
    </>
  );
};

export default withAuth(CreateOneTime);
