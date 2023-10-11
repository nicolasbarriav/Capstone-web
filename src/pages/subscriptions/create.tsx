import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useQuery } from 'react-query';
import type { ZodIssue } from 'zod';

import NavBar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import useForm from '@/hooks/useForm';
import { useMultistepForm } from '@/hooks/useMultistepForm';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import getDebtors from '@/utils/api/debtors/getDebtors';

import formatRut from '@/utils/functions/formatRut';
import withAuth from '@/components/withAuth';
import createSubscription from '@/utils/api/subscriptions/createSubscription';
import {
  subscriptionSchama,
  notificationSchema,
  debtorSchema,
} from '@/components/subscription/validators/create-subscription-validator';
import { getNextValidDate } from '@/utils/functions/getNextValidDate';
import { SubscriptionForm } from '@/components/subscription/forms/subscriptionDataForm';
import { DebtorForm } from '@/components/subscription/forms/debtorForm';
import { NotificationMethodForm } from '@/components/subscription/forms/notificationMethodForm';
import getTemplates from '@/utils/api/subscriptions/queries/getTemplates';
import Stepper from '@/components/stepper';
import { removeDots } from '@/utils/functions/formatNumber';

const initialValues = {
  title: '',
  description: '',
  amount: '',
  currency: 'CLP',
  frecuency: 'monthly',
  start_date: '',
  payment_timing_preference_id: -1,
  total_cycles: '',
  debtor_exists: false,
  is_company: true,
  debtor_name: '',
  government_id: '',
  debtor_id: -1,
  phone: '',
  email: '',
  notification_method: 'mail',
  notify_before: false,
  save_template: false,
};

type Props = {
  accessToken?: string;
};
const CreateSubscription: React.FC<Props> = ({ accessToken }) => {
  const router = useRouter();

  const { form, setForm, onChange, errors, resetErrors, setErrors } = useForm(
    initialValues,
    subscriptionSchama.merge(notificationSchema).merge(debtorSchema)
  );
  const { isLoading: debtorsLoading, data: debtors } = useQuery(
    ['getDebtors', accessToken],
    () => getDebtors(String(accessToken)),
    {
      enabled: !!accessToken,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  const templates = useQuery(['templates', accessToken], () => {
    return getTemplates(String(accessToken));
  });

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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateValue = `${e.target.value}T05:00:00.000Z`;

    const nextValidDate = getNextValidDate(new Date(selectedDateValue));
    if (nextValidDate) {
      e.target.value = nextValidDate;
    }
    setForm({ ...form, start_date: e.target.value });
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
  const handleCyclesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setForm({ ...form, total_cycles: onlyNums });
  };
  const handleExistingDebtorChange = (e: number) => {
    const debtor = debtors?.find((d) => d.id === e);
    setForm({
      ...form,
      debtor_exists: true,
      debtor_id: debtor?.id || -1,
      debtor_name: debtor?.name || '',
      phone: debtor?.phone || '',
      email: debtor?.email || '',
    });
  };

  const handleNotificationMethodChange = (data: string) => {
    setForm({ ...form, notification_method: data });
  };

  const {
    step,
    isFirstStep,
    isLastStep,
    back,
    next,
    currentValidation,
    currentStepIndex,
  } = useMultistepForm(
    [
      <SubscriptionForm
        {...form}
        templates={templates.data || []}
        selectTemplate={(template) => {
          setForm({
            ...form,
            title: template.title,
            description: template.description,
            amount: String(template.amount),
            currency: template.currency,
            frecuency: template.frecuency,
            start_date: String(template.startDate.toISOString().split('T')[0]),
            payment_timing_preference_id: template.paymentTimingPreferenceId,
            total_cycles: String(template.totalCycles),
          });
        }}
        updateFields={onChange}
        errors={errors}
        handleAmountChange={handleAmountChange}
        handleStartDateChange={handleStartDateChange}
        handlePaymentTimingPreferenceChange={(value) => {
          setForm({
            ...form,
            payment_timing_preference_id: value,
          });
        }}
        handleFrecuencyChange={(value) => {
          setForm({
            ...form,
            frecuency: value,
          });
        }}
        handleCycleChange={handleCyclesChange}
        key="1"
      />,
      <DebtorForm
        {...form}
        debtors={debtors}
        updateFields={onChange}
        handleNotificationMethodChange={handleNotificationMethodChange}
        errors={errors}
        handleCompanyChange={handleCompanyChange}
        handleSwitchChange={handleSwitchChange}
        handleRUTChange={handleRUTChange}
        handleExistingDebtorChange={handleExistingDebtorChange}
        key="2"
      />,
      <NotificationMethodForm
        {...form}
        debtors={debtors}
        updateFields={onChange}
        errors={errors}
        key="3"
      />,
    ],
    [subscriptionSchama, debtorSchema, notificationSchema]
  );

  const validateCurrentStep = () => {
    if (!currentValidation) throw new Error("Can't validate current step");
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
        await createSubscription(
          {
            ...form,
            total_cycles: Number(form.total_cycles),
            amount: Number(removeDots(form.amount)),
          },

          String(accessToken)
        );
        router.push('/subscriptions');
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
                  steps={['Suscripción', 'Cliente', 'Notificación']}
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

export default withAuth(CreateSubscription);
