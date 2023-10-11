import type { ChangeEvent } from 'react';
import type { ZodIssue } from 'zod';

import { FormWrapper } from './FormWrapper';
import InputComponent from '../shared/forms/inputComponent';
import TextAreaComponent from '../shared/forms/textAreaComponent';
import DateInputComponent from '../shared/forms/dateInputComponent';

type TicketData = {
  ticket_name: string;
  ticket_description: string;
  amount: string;
  currency: string;
  payment_due_date: string;
  internal_comment: string;
  errors: Record<string, '' | ZodIssue>;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type TicketFormProps = TicketData & {
  updateFields: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
};

export function TicketForm({
  ticket_name,
  ticket_description,
  internal_comment,
  amount,
  currency,
  payment_due_date,
  updateFields,
  errors,
  handleAmountChange,
  handlePaymentDueDateChange,
}: TicketFormProps) {
  return (
    <FormWrapper title="Detalles del ticket 🧾">
      <div className="px-4 py-6 sm:gap-4 sm:px-6">
        <InputComponent
          name="ticket_name"
          title="Nombre del ticket"
          value={ticket_name}
          onChange={updateFields}
          error={errors.ticket_name}
          type="text"
        />
      </div>
      <div className="px-4 py-6 sm:gap-4 sm:px-6">
        <div className="relative">
          <label
            htmlFor="comment"
            className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            Descripción del ticket (opcional/publica)
          </label>
          <div className="mt-2">
            <textarea
              rows={2}
              name="ticket_description"
              id="comment"
              className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={ticket_description}
              onChange={updateFields}
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-6 sm:gap-4 sm:px-6">
        <TextAreaComponent
          name="internal_comment"
          title="Comentario interno (opcional)"
          value={internal_comment}
          onChange={updateFields}
          rows={2}
          error={errors.internal_comment}
          type="text"
        />
      </div>
      <div className="grid px-4 py-6 sm:grid-cols-2 sm:gap-4 sm:px-6">
        <div className="relative my-4 flex flex-col sm:my-0">
          <label
            htmlFor="amount"
            className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            Cantidad a cobrar
          </label>
          <input
            type="text"
            id="price"
            className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={amount}
            onChange={handleAmountChange}
            name="amount"
          />
          {errors.amount && (
            <p className="text-left text-xs italic text-red-500">
              {errors.amount.message}
            </p>
          )}
        </div>
        <div className="relative my-4 flex flex-col sm:my-0">
          <label
            htmlFor="currency"
            className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            Moneda
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
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <div className="relative flex flex-col">
          <DateInputComponent
            name="payment_due_date"
            title="Fecha de pago"
            value={payment_due_date}
            onChange={handlePaymentDueDateChange}
          />

          <p className="text-xs">
            *recuerda que no se puede cobrar los domingos
          </p>
          <p className="text-xs">
            *Si la fecha es anterior a hoy, se cobrará el día siguiente
          </p>
          {errors.payment_due_date && (
            <p className="text-left text-xs italic text-red-500">
              {errors.payment_due_date.message}
            </p>
          )}
        </div>
      </div>
    </FormWrapper>
  );
}
