import 'react-phone-input-2/lib/style.css';

import { Switch } from '@headlessui/react';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import type { ZodIssue } from 'zod';

import type { Debtor } from '@/utils/api/debtors/getDebtorInfo';
import classNames from '@/utils/functions/classNames';
import getNameByRUT, { verifyRutDigit } from '@/utils/functions/getNameByRut';

import ComboBox from '../comboBox';
import { FormWrapper } from './FormWrapper';

type DebtorData = {
  debtor_exists: boolean;
  is_company: boolean;
  debtor_name: string;
  government_id: string;
  phone: string;
  email: string;
  errors: Record<string, '' | ZodIssue>;
  debtors: Debtor[] | undefined;
  handleSwitchChange: (e: boolean) => void;
  handleRUTChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompanyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNotifyMethod: (data: string) => void;
};

type DebtorFormProps = DebtorData & {
  updateFields: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
};

export function DebtorForm({
  debtor_exists,
  is_company,
  debtor_name,
  government_id,
  phone,
  email,
  updateFields,
  errors,
  debtors,
  handleSwitchChange,
  handleRUTChange,
  handleCompanyChange,
  handleNotifyMethod,
}: DebtorFormProps) {
  const [rutMessage, setRutMessage] = useState<string | null>(null);
  const [debtorId, setDebtorId] = useState<number>();

  function validateDebtorExistance() {
    if (!debtor_exists && debtors && Array.isArray(debtors)) {
      const debtorPhone = phone;
      const debtorEmail = email;
      const debtorGovernmentId = government_id;
      const debtor = debtors.find(
        (debtorAux) =>
          debtorAux.phone === debtorPhone &&
          debtorAux.email === debtorEmail &&
          debtorAux.government_id === debtorGovernmentId
      );
      if (debtor) {
        return debtor;
      }
    }
    return undefined;
  }

  useEffect(() => {
    const debtor = validateDebtorExistance();
    if (debtor) {
      updateFields({
        target: {
          name: 'confirm_debtor_existance',
          value: true,
        },
      } as any);
    } else {
      updateFields({
        target: {
          name: 'confirm_debtor_existance',
          value: false,
        },
      } as any);
    }
  }, [debtor_exists, is_company, debtor_name, government_id, phone, email]);

  useEffect(() => {
    const rutNotFormatted = government_id.replace(/[^0-9kK]+/g, '');
    if (rutNotFormatted.length > 7) {
      getNameByRUT(rutNotFormatted)
        .then((name) => {
          if (name) {
            updateFields({
              target: {
                name: 'debtor_name',
                value: name,
              },
            } as any);
            setRutMessage(null);
          } else if (!verifyRutDigit(rutNotFormatted)) {
            setRutMessage('Ingresa un RUT válido 👮🏽‍♀️');
          }
        })
        .catch((error) => {
          console.error(error);
          setRutMessage(null);
        });
    } else {
      setRutMessage(null);
    }
  }, [government_id]);

  useEffect(() => {
    if (debtorId) {
      updateFields({
        target: {
          name: 'debtor_id',
          value: debtorId,
        },
      } as any);
    }
  }, [debtorId]);

  useEffect(() => {
    if (email.length > 2) {
      handleNotifyMethod('mail');
    }
    if (phone.length > 2 && email.length < 2) {
      handleNotifyMethod('whatsapp');
    }
  }, [email, phone]);

  return (
    <FormWrapper title="¿A quién le quieres cobrar? 👤">
      <div className="px-4 py-6 sm:gap-4 sm:px-6">
        <div className="flex flex-row justify-center">
          <p className="px-4 text-sm">¿Selecionar uno existente?</p>
          <Switch
            checked={debtor_exists}
            onChange={handleSwitchChange}
            className={classNames(
              debtor_exists ? 'bg-indigo-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              className={classNames(
                debtor_exists ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              )}
            >
              <span
                className={classNames(
                  debtor_exists
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
                  debtor_exists
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
        {!debtor_exists ? (
          <>
            <fieldset className="mx-5 my-4">
              <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                {['Empresa', 'Persona natural'].map((debtorType) => (
                  <div key={debtorType} className="flex items-center">
                    <input
                      id={debtorType}
                      name="debtorType"
                      type="radio"
                      defaultChecked={debtorType === 'Empresa'}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={handleCompanyChange}
                    />
                    <label
                      htmlFor={debtorType}
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      {debtorType}
                    </label>
                  </div>
                ))}
              </div>
              {errors.confirm_debtor_existance && (
                <p className="pt-2 text-left text-xs italic text-red-500">
                  {errors.confirm_debtor_existance.message}
                </p>
              )}
            </fieldset>
            {is_company ? (
              <>
                <div className="relative grid sm:grid-cols-2 sm:gap-4">
                  <div className="relative my-2 flex flex-col">
                    <label
                      htmlFor="razonSocial"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Razón social
                    </label>
                    <input
                      type="text"
                      id="razonSocial"
                      className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={debtor_name}
                      onChange={updateFields}
                      name="debtor_name"
                    />
                    {errors.debtor_name && (
                      <p className="text-left text-xs italic text-red-500">
                        {errors.debtor_name.message}
                      </p>
                    )}
                  </div>
                  <div className="relative my-2 flex flex-col">
                    <label
                      htmlFor="rutEmpresa"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Rut empresa
                    </label>
                    <input
                      type="text"
                      name="rutEmpresa"
                      id="rutEmpresa"
                      value={government_id}
                      onChange={handleRUTChange}
                      className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {rutMessage ||
                    (errors.government_id && errors.government_id?.message) ? (
                      <p className="text-left text-xs italic text-red-500">
                        {rutMessage ||
                          // @ts-ignore
                          errors.government_id?.message!}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="relative grid sm:grid-cols-2 sm:gap-4">
                  <div className="relative my-2 flex flex-col">
                    <label
                      htmlFor="mail"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Mail de contacto
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="mail"
                      value={email}
                      onChange={updateFields}
                      className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.email && (
                      <p className="text-left text-xs italic text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="relative my-2 flex flex-col">
                    <PhoneInput
                      country={'cl'}
                      containerStyle={{ width: '100%' }}
                      inputStyle={{ width: '100%' }}
                      value={phone}
                      onChange={(e) =>
                        updateFields({
                          target: {
                            name: 'phone',
                            value: e,
                          },
                        } as any)
                      }
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative grid sm:grid-cols-2 sm:gap-4">
                  <div className="relative my-2 flex flex-col">
                    <label
                      htmlFor="nombre"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Nombre y apellido
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={debtor_name}
                      onChange={updateFields}
                      name="debtor_name"
                    />
                    {errors.debtor_name && (
                      <p className="text-left text-xs italic text-red-500">
                        {errors.debtor_name.message}
                      </p>
                    )}
                  </div>
                  <div className="relative my-2 flex flex-col">
                    <label
                      htmlFor="government_id"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Rut (opcional)
                    </label>
                    <input
                      type="text"
                      name="government_id"
                      id="government_id"
                      value={government_id}
                      onChange={handleRUTChange}
                      className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {rutMessage ||
                    (errors.government_id && errors.government_id?.message) ? (
                      <p className="text-left text-xs italic text-red-500">
                        {rutMessage ||
                          // @ts-ignore
                          errors.government_id?.message!}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="relative grid sm:grid-cols-2 sm:gap-4">
                  <div className="relative my-2 flex flex-col">
                    <label
                      htmlFor="mail"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Mail de contacto
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="mail"
                      value={email}
                      onChange={updateFields}
                      className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.email && (
                      <p className="text-left text-xs italic text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="relative my-2 flex flex-col">
                    <PhoneInput
                      country={'cl'}
                      containerStyle={{ width: '100%' }}
                      inputStyle={{ width: '100%' }}
                      value={phone}
                      onChange={(e) =>
                        updateFields({
                          target: {
                            name: 'phone',
                            value: e,
                          },
                        } as any)
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-center">
              {errors.debtor_id && (
                <p className="text-left text-xs italic text-red-500">
                  {errors.debtor_id.message}
                </p>
              )}
            </div>
            <div className="flex justify-center pb-10">
              {debtors ? (
                <ComboBox options={debtors} setOption={setDebtorId}></ComboBox>
              ) : null}
            </div>
          </>
        )}
      </div>
    </FormWrapper>
  );
}
