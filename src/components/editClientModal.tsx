import 'react-phone-input-2/lib/style.css';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PhoneInput from 'react-phone-input-2';
import { z } from 'zod';

import useForm from '@/hooks/useForm';
import type { Debtor } from '@/utils/api/debtors/getDebtorInfo';
import updateDebtor from '@/utils/api/debtors/updateDebtor';
import formatRut from '@/utils/functions/formatRut';

import { auth } from '../utils/firebase';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  debtor: Debtor;
}

const validations = z.object({
  is_company: z.boolean(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  government_id: z.string(),
  id: z.number(),
});

export default function EditClientModal({ open, setOpen, debtor }: Props) {
  const initialValues = {
    is_company: debtor.is_company,
    name: debtor.name,
    government_id: debtor.government_id,
    id: debtor.id,
    phone: debtor.phone,
    email: debtor.email,
  };
  const { form, setForm, onChange, errors, validateForm } = useForm(
    initialValues,
    validations
  );
  const [user] = useAuthState(auth);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => setAccessToken(token));
    }
  }, []);

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, government_id: formatRut(e.target.value) });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, is_company: e.target.id === 'Empresa' });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid.success) {
      if (form.name !== '' && form.phone !== '' && form.email !== '') {
        setOpen(false);
        updateDebtor(form, accessToken);
      }
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 min-h-screen overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all">
                <div>
                  <div className="mt-5 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Editar información cliente
                    </Dialog.Title>
                    <form
                      className="mt-4 space-y-4"
                      onSubmit={onSubmit}
                      method="PATCH"
                    >
                      <fieldset className="mx-5 mt-4">
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
                      </fieldset>
                      {form.is_company ? (
                        <>
                          <div className="relative grid grid-cols-2 gap-4">
                            <div className="relative flex flex-col">
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
                                value={form.name}
                                onChange={onChange}
                                name="name"
                              />
                              {errors.name && (
                                <p className="text-left text-xs italic text-red-500">
                                  {errors.name.message}
                                </p>
                              )}
                            </div>
                            <div className="relative flex flex-col">
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
                                value={form.government_id}
                                onChange={handleRUTChange}
                                className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="relative grid grid-cols-2 gap-4">
                            <div className="relative flex flex-col">
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
                                value={form.email}
                                onChange={onChange}
                                className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              {errors.email && (
                                <p className="text-left text-xs italic text-red-500">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                            <div className="relative flex flex-col">
                              <PhoneInput
                                country={'cl'}
                                containerStyle={{ width: '100%' }}
                                inputStyle={{ width: '100%' }}
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e })}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative grid grid-cols-2 gap-4">
                            <div className="relative flex flex-col">
                              <label
                                htmlFor="nombre"
                                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                              >
                                Nombre
                              </label>
                              <input
                                type="text"
                                id="nombre"
                                className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={form.name}
                                onChange={onChange}
                                name="name"
                              />
                              {errors.name && (
                                <p className="text-left text-xs italic text-red-500">
                                  {errors.name.message}
                                </p>
                              )}
                            </div>
                            <div className="relative flex flex-col">
                              <label
                                htmlFor="government_id"
                                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                              >
                                Rut
                              </label>
                              <input
                                type="text"
                                name="government_id"
                                id="government_id"
                                value={form.government_id}
                                onChange={handleRUTChange}
                                className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="relative grid grid-cols-2 gap-4">
                            <div className="relative flex flex-col">
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
                                value={form.email}
                                onChange={onChange}
                                className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              {errors.email && (
                                <p className="text-left text-xs italic text-red-500">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                            <div className="relative flex flex-col">
                              <PhoneInput
                                country={'cl'}
                                containerStyle={{ width: '100%' }}
                                inputStyle={{ width: '100%' }}
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e })}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="mt-5 sm:mt-6">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Editar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
