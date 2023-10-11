import 'react-phone-input-2/lib/style.css';

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import type { ZodIssue } from 'zod';

import type { Debtor } from '@/utils/api/debtors/getDebtorInfo';
import getNameByRUT from '@/utils/functions/getNameByRut';

import SwitchComponent from '@/components/shared/forms/switchComponent';
import InputComponent from '@/components/shared/forms/inputComponent';
import { FormWrapper } from '@/components/create-one-time/FormWrapper';
import ComboBox from '@/components/comboBox';

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
  handleExistingDebtorChange: (e: number) => void;
  handleNotificationMethodChange: (data: string) => void;
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
  handleExistingDebtorChange,
  handleNotificationMethodChange,
}: DebtorFormProps) {
  const [rutMessage, setRutMessage] = useState<string | null>(null);

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
          } else {
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
    if (email.length > 2) {
      handleNotificationMethodChange('email');
    } else if (phone.length > 2) {
      handleNotificationMethodChange('whatsapp');
    }
  }, [email, phone]);

  return (
    <FormWrapper title="¿A quién le quieres cobrar? 👤">
      <div className="px-4 py-6 sm:gap-4 sm:px-6">
        <div className="flex flex-row justify-center">
          <p className="px-4 text-sm">¿Selecionar uno existente?</p>
          <SwitchComponent
            checked={debtor_exists}
            onChange={handleSwitchChange}
          />
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
            {
              <>
                <div className="relative grid sm:grid-cols-2 sm:gap-4">
                  <div className="my-2 flex flex-col">
                    <InputComponent
                      title={is_company ? 'Razón social' : 'Nombre y apellido'}
                      name="debtor_name"
                      value={debtor_name}
                      onChange={updateFields}
                      error={errors.debtor_name}
                      type="text"
                    />
                  </div>
                  <div className="my-2 flex flex-col">
                    <InputComponent
                      title={is_company ? 'Rut empresa' : 'Rut'}
                      name="government_id"
                      value={government_id}
                      onChange={handleRUTChange}
                      error={
                        rutMessage
                          ? { message: rutMessage }
                          : errors.government_id
                      }
                      type="text"
                    />
                  </div>
                </div>
                <div className="relative grid sm:grid-cols-2 sm:gap-4">
                  <div className="my-2 flex flex-col">
                    <InputComponent
                      title="Mail de contacto"
                      name="email"
                      value={email}
                      onChange={updateFields}
                      error={errors.email}
                      type="email"
                    />
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
            }
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
                <ComboBox
                  options={debtors}
                  setOption={handleExistingDebtorChange}
                ></ComboBox>
              ) : null}
            </div>
          </>
        )}
      </div>
    </FormWrapper>
  );
}
