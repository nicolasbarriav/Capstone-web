import 'react-phone-input-2/lib/style.css';

import {
  ArrowSmallLeftIcon,
  IdentificationIcon,
} from '@heroicons/react/20/solid';
import { BuildingLibraryIcon, PencilIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useQuery } from 'react-query';
import { z } from 'zod';

import NavBar from '@/components/navbar';
import useForm from '@/hooks/useForm';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import getBankAcount from '@/utils/api/getBankAccount';
import getProfileQuery from '@/utils/api/users/queries/get-profile.query';
import updateProfile from '@/utils/api/users/updateProfile';
import getBankName from '@/utils/functions/getBankName';
import withAuth from '@/components/withAuth';

const initialValues = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
};

const validations = z.object({
  first_name: z.string().nonempty('Verifica tu nombre 😅'),
  last_name: z.string().nonempty('Verifica tu apellido 😅'),
  phone: z
    .string()
    .nonempty('Necesitamos tu celular para contactarte de alguna forma 🤷🏽'),
  email: z.string().nonempty('Mail inválido 👮🏽‍♀️'),
});

type Props = {
  accessToken?: string;
};
const ProfilePage: React.FC<Props> = ({ accessToken }) => {
  const { form, setForm, onChange, errors, validateForm } = useForm(
    initialValues,
    validations
  );
  const [edit, setEdit] = useState(false);

  const { isLoading: profileLoading, data: profile } = useQuery(
    ['getProfile', accessToken],
    () => getProfileQuery(String(accessToken)),
    {
      enabled: !!accessToken,
    }
  );

  const { isLoading: bankAccountLoading, data: bankAccount } = useQuery(
    ['getBankAcount', accessToken],
    () => getBankAcount(String(accessToken)),
    {
      enabled: !!accessToken,
    }
  );

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        email: profile.email,
      });
    }
  }, [profile]);

  if (profileLoading || bankAccountLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-indigo-600"
          style={{ borderTopColor: 'currentColor' }}
        ></div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid.success) {
      return;
    }
    try {
      updateProfile(form, String(accessToken)).then(() => {
        setEdit(false);
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <>
      <Main meta={<Meta title="vambe" description="" />}>
        <NavBar />
        <main>
          <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <svg
              className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                  width={200}
                  height={200}
                  x="50%"
                  y={-64}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={-64} className="overflow-visible fill-gray-50">
                <path
                  d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
              />
            </svg>
            <div className="mx-auto max-w-xl lg:max-w-4xl">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Mi cuenta
              </h2>
              {!edit ? (
                <div className="m-5 overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                    <div className="flex items-center">
                      <IdentificationIcon
                        className="h-7 w-7 text-gray-400"
                        aria-hidden="true"
                      />
                      <h3 className="ml-2 text-2xl font-semibold text-gray-900">
                        Información de contacto
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="flex items-center"
                      onClick={() => setEdit(true)}
                    >
                      <PencilIcon
                        className="mx-1 h-4 w-4 text-indigo-600"
                        aria-hidden="true"
                      />
                      <h3 className="mr-2 text-lg font-semibold text-indigo-600">
                        Editar
                      </h3>
                    </button>
                  </div>

                  <div>
                    <dl className="divide-y divide-gray-300 px-4">
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                          Nombre
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {form.first_name}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                          Apellido
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {form.last_name}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                          Mail
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {form.email}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                          Teléfono
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          +{form.phone}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : (
                <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
                  <ArrowSmallLeftIcon
                    className="h-8 w-8 cursor-pointer text-gray-600"
                    onClick={() => setEdit(false)}
                  />
                  <form
                    action="#"
                    method="PUT"
                    onSubmit={onSubmit}
                    className="lg:flex-auto"
                  >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          Nombre
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={form.first_name}
                            onChange={onChange}
                          />
                        </div>
                        {errors.first_name && (
                          <p className="text-left text-xs italic text-red-500">
                            {errors.first_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          Apellido
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={form.last_name}
                            onChange={onChange}
                          />
                        </div>
                        {errors.last_name && (
                          <p className="text-left text-xs italic text-red-500">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="budget"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          Número de contacto
                        </label>
                        <div className="mt-2.5">
                          <PhoneInput
                            country={'cl'}
                            containerStyle={{ width: '100%' }}
                            inputStyle={{ width: '100%' }}
                            value={form.phone}
                            onChange={(e) => {
                              const syntheticEvent = {
                                target: {
                                  name: 'phone',
                                  value: e,
                                },
                              };
                              if (/^\d*$/.test(e)) {
                                onChange(
                                  syntheticEvent as React.ChangeEvent<HTMLInputElement>
                                );
                              }
                            }}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-left text-xs italic text-red-500">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="website"
                          className="block text-sm font-semibold text-gray-900"
                        >
                          Mail de contacto
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            name="email"
                            id="mail"
                            value={form.email}
                            onChange={onChange}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.email && (
                            <p className="text-left text-xs italic text-red-500">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-10">
                      <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <div className="m-5 overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                  <div className="flex items-center">
                    <BuildingLibraryIcon
                      className="h-7 w-7 text-gray-400"
                      aria-hidden="true"
                    />
                    <h3 className="ml-2 text-2xl font-semibold text-gray-900">
                      Cuenta bancaria
                    </h3>
                  </div>
                </div>
                <p className="ml-6 max-w-2xl text-sm leading-6 text-gray-500">
                  Por tu seguridad, para editar o cambiar tu cuenta contactenos
                  al +56977480065
                </p>

                <div>
                  <dl className="divide-y divide-gray-300 px-4">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-900">
                        Razón social
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {bankAccount?.full_name}
                      </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-900">Rut</dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {bankAccount?.holder_identifier}
                      </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-900">
                        Banco
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {getBankName(bankAccount?.bank_brand)}
                      </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-900">
                        Tipo de cuenta
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {bankAccount?.account_type === 'cc'
                          ? 'Cuenta corriente'
                          : 'Cuenta vista'}
                      </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-900">
                        Numero de cuenta
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {bankAccount?.account_number}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Main>
    </>
  );
};

export default withAuth(ProfilePage);
