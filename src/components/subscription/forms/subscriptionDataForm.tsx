import 'react-phone-input-2/lib/style.css';

import { useState, type ChangeEvent } from 'react';

import { FormWrapper } from '@/components/create-one-time/FormWrapper';
import InputComponent from '@/components/shared/forms/inputComponent';
import type { ZodIssue } from 'zod';
import ComboBox from '@/components/comboBox';
import DateInputComponent from '@/components/shared/forms/dateInputComponent';
import { getNextValidDate } from '@/utils/functions/getNextValidDate';
import getPaymentTimingPreference from '@/utils/functions/getPaymentTimingPreference';
import type Template from '@/utils/api/subscriptions/domain/template';
import SwitchComponent from '@/components/shared/forms/switchComponent';
import TextAreaComponent from '@/components/shared/forms/textAreaComponent';
import formatNumber from '@/utils/functions/formatNumber';

type SubscriptionData = {
  title: string;
  description: string;
  amount: string;
  currency: string;
  frecuency: string;
  start_date: string;
  payment_timing_preference_id: number;
  total_cycles: string;
  errors: Record<string, '' | ZodIssue>;
  templates: Template[];
  selectTemplate: (template: Template) => void;
  handleFrecuencyChange: (e: string) => void;
  handleCycleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentTimingPreferenceChange: (e: number) => void;
};

type SubscriptionFormProps = SubscriptionData & {
  updateFields: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
};

const frecuencyOptions = [
  { id: 'weekly', name: 'Semanal' },
  { id: 'monthly', name: 'Mensual' },
  { id: 'annually', name: 'Anual' },
];
export function SubscriptionForm({
  title,
  description,
  amount,
  currency,
  frecuency,
  start_date,
  total_cycles,
  templates,
  payment_timing_preference_id,
  selectTemplate,
  updateFields,
  handleFrecuencyChange,
  handlePaymentTimingPreferenceChange,
  handleCycleChange,
  handleStartDateChange,
  errors,
}: SubscriptionFormProps) {
  const [openTemplate, setOpenTemplate] = useState(false);
  return (
    <FormWrapper title="Detalles de la suscripción 🔁">
      {templates?.length > 0 && (
        <div className="px-4 py-6 sm:gap-4 sm:px-6">
          <div className="justify-center space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            <p className="px-4 text-sm">¿Quieres usar una plantilla?</p>
            <SwitchComponent
              checked={openTemplate}
              onChange={setOpenTemplate}
            />
          </div>
        </div>
      )}
      {openTemplate && (
        <div>
          <label className="inline-block bg-white px-1 text-left text-xs font-medium text-gray-900">
            Elija una plantilla:
          </label>
          <ComboBox
            options={templates.map((t) => ({
              ...t,
              name: t.title,
            }))}
            setOption={(option) => {
              const template = templates.find((t) => t.id === option);
              if (template) selectTemplate(template);
            }}
            option={
              templates[0] && { ...templates[0], name: templates[0].title }
            }
          />
        </div>
      )}

      <div className="px-4 py-6 sm:gap-4 sm:px-6">
        <InputComponent
          title="Nombre de la suscripción"
          name="title"
          value={title}
          onChange={updateFields}
          error={errors.title}
          type="text"
        />
      </div>
      <div className="px-4 py-6 sm:gap-4 sm:px-6">
        <TextAreaComponent
          title="Descripción de la suscripción (opcional)"
          name="description"
          value={description}
          onChange={updateFields}
          error={errors.description}
          type="text"
          rows={2}
        />
      </div>
      <div className="grid px-4 py-6 sm:grid-cols-2 sm:gap-4 sm:px-6">
        <InputComponent
          title="Monto de cada cobro"
          name="amount"
          value={amount}
          onChange={(e) => {
            e.target.value = formatNumber(e.target.value);
            updateFields(e);
          }}
          error={errors.amount}
          type="text"
        />
        <div className="relative my-4 flex flex-col sm:my-0">
          <label
            htmlFor="currency"
            className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            Moneda de la suscripción
          </label>
          <select
            id="currency"
            className="rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={currency}
            onChange={updateFields}
            name="currency"
          >
            <option value="CLP">CLP</option>
            <option value="UF">UF</option>
          </select>
        </div>
      </div>
      <div className="grid px-4 py-6 sm:grid-cols-2 sm:gap-4 sm:px-6">
        <div className="relative my-4 flex flex-col sm:my-0">
          <label
            htmlFor="frecuency"
            className="inline-block bg-white px-1 text-left text-xs font-medium text-gray-900"
          >
            Frecuencia del Cobro
          </label>
          <ComboBox
            options={frecuencyOptions}
            setOption={handleFrecuencyChange}
            option={frecuencyOptions.find((option) => option.id === frecuency)}
          />
        </div>
        <div className="relative my-4 flex flex-col sm:my-0">
          <label
            htmlFor="due-date"
            className="inline-block bg-white px-1 text-left text-xs font-medium text-gray-900"
          >
            Preferencia de cobro
          </label>
          <ComboBox
            options={getPaymentTimingPreference(frecuency)}
            setOption={handlePaymentTimingPreferenceChange}
            option={getPaymentTimingPreference(frecuency).find(
              (option) => option.id === payment_timing_preference_id
            )}
          ></ComboBox>
        </div>
      </div>

      <div className="grid px-4 py-6 sm:grid-cols-2 sm:gap-4 sm:px-6">
        <DateInputComponent
          name="start_date"
          onChange={handleStartDateChange}
          value={start_date}
          title="Fecha de inicio"
          min={getNextValidDate(new Date())}
        />
        <div className="my-4 sm:my-0">
          <InputComponent
            title="Cantidad de Cobros"
            name="total_cycles"
            value={total_cycles}
            onChange={handleCycleChange}
            error={errors.total_cycles}
            type="number"
          />
        </div>
      </div>
    </FormWrapper>
  );
}
