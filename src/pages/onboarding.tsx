import 'react-phone-input-2/lib/style.css';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PhoneInput from 'react-phone-input-2';
import { useQuery } from 'react-query';
import { z } from 'zod';

import ComboBox from '@/components/comboBox';
import NavBar from '@/components/navbar';
import useForm from '@/hooks/useForm';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import createProfile from '@/utils/api/users/createProfile';
import { banks } from '@/utils/constants/banks';
import { auth } from '@/utils/firebase';
import formatRut from '@/utils/functions/formatRut';
import getNameByRUT, { verifyRutDigit } from '@/utils/functions/getNameByRut';

import getProfile from '../utils/api/users/getProfile';

const initialValues = {
  first_name: '',
  last_name: '',
  phone: '',
  full_name: '',
  holder_identifier: '',
  bank_brand: '',
  account_type: '',
  account_number: '',
  email: '',
  bank_email: '',
};

const validations = z.object({
  first_name: z.string().min(2, { message: 'Verifica tu nombre 😅' }),
  last_name: z.string().min(2, { message: 'Verifica tu apellido 😅' }),
  phone: z.string().min(11, {
    message: 'Necesitamos tu celular para contactarte de alguna forma 🤷🏽',
  }),
  full_name: z
    .string()
    .min(2, { message: 'Verifica el nombre del titular 😅' }),
  holder_identifier: z
    .string()
    .min(11, { message: 'Necesitamos tu rut para depositarte tus cobros 😁' }),
  bank_brand: z
    .string()
    .min(2, { message: 'Por favor, selecciona tu banco 🏦' }),
  account_type: z
    .string()
    .min(2, { message: 'Por favor, selecciona el tipo de cuenta 📑' }),
  account_number: z.string().min(5, {
    message: 'Necesitamos tu cuenta para depositarte tus cobros 😁',
  }),
  email: z.string().email({ message: 'Mail inválido 👮🏽‍♀️' }),
  bank_email: z.string().email({ message: 'Mail inválido 👮🏽‍♀️' }),
});

const Onboarding = () => {
  const router = useRouter();

  const [user, loading] = useAuthState(auth);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [rutMessage, setRutMessage] = useState<string | null>(null);
  const { form, setForm, onChange, errors, validateForm } = useForm(
    initialValues,
    validations
  );

  const { data: profile } = useQuery(
    ['getProfile', accessToken],
    () => getProfile(accessToken),
    {
      enabled: !!accessToken, // only run the query if the accessToken is available
    }
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid.success || rutMessage) {
      return;
    }
    try {
      createProfile(form, accessToken).then(() => {
        router.reload();
        router.push('/dashboard');
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: formatRut(e.target.value),
      },
    };
    onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    if (user) {
      const nameComposition = user.displayName?.split(' ');
      const firstName = nameComposition?.[0] || '';
      const lastName = nameComposition?.[1] || '';
      setForm({
        ...form,
        first_name: firstName,
        last_name: lastName,
        email: user.email || '',
        full_name: user.displayName?.trim() || '',
        bank_email: user.email || '',
      });
      user.getIdToken().then((token) => setAccessToken(token));
    }
  }, [user]);

  useEffect(() => {
    if (profile && !profile.statusCode) {
      router.replace('/dashboard');
    }
  }, [profile]);

  useEffect(() => {
    const rutNotFormatted = form.holder_identifier.replace(/[^0-9kK]+/g, '');
    if (rutNotFormatted.length > 7) {
      getNameByRUT(rutNotFormatted)
        .then((name) => {
          if (name) {
            setForm({
              ...form,
              full_name: name,
            });
            setRutMessage(null);
          } else if (!verifyRutDigit(rutNotFormatted)) {
            setRutMessage('Ingresa un RUT válido 👮🏽‍♀️');
          }
        })
        .catch((error) => {
          console.error(error);
          setRutMessage(null);
        });
    } else if (!verifyRutDigit(rutNotFormatted)) {
      setRutMessage('Ingresa un RUT válido 👮🏽‍♀️');
    } else {
      setRutMessage(null);
    }
  }, [form.holder_identifier]);

  const onChangeNumeric = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    value = value.replace(/\D/g, '');

    onChange({
      target: {
        type: 'input',
        value,
        name: event.target.name,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const createChangeHandler = (fieldName: string) => (option: any) => {
    const syntheticEvent = {
      target: {
        name: fieldName,
        value: option,
      },
    };
    onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  if (loading || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-indigo-600"
          style={{ borderTopColor: 'currentColor' }}
        ></div>
      </div>
    );
  }

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
                ¡Estás a un paso de ahorrar horas de cobranza y mejorara tus
                flujos de caja!
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                ¿Cuáles son tus datos?
              </p>
              <div className="mt-6 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
                <form
                  action="#"
                  method="POST"
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
                    <p className="text-base leading-8 text-gray-600 sm:col-span-2">
                      ¿A qué cuenta quieres recibir los pagos de tu cobranza?
                    </p>
                    <div>
                      <label
                        htmlFor="full-name"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Razón social o nombre completo
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          name="full_name"
                          id="full_name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={form.full_name}
                          onChange={onChange}
                        />
                      </div>
                      {errors.full_name && (
                        <p className="text-left text-xs italic text-red-500">
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Rut
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          name="holder_identifier"
                          id="holder_identifier"
                          autoComplete="holder_identifier"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={form.holder_identifier}
                          onChange={handleRUTChange}
                        />
                      </div>
                      {rutMessage && (
                        <p className="text-left text-xs italic text-red-500">
                          {rutMessage}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="bank"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Banco
                      </label>
                      <div className="mt-2.5">
                        <ComboBox
                          options={banks}
                          setOption={createChangeHandler('bank_brand')}
                        ></ComboBox>
                        {errors.bank_brand && (
                          <p className="text-left text-xs italic text-red-500">
                            {errors.bank_brand.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="bank-type"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Tipo de cuenta
                      </label>
                      <div className="mt-2.5">
                        <ComboBox
                          options={[
                            {
                              name: 'Cuenta corriente',
                              id: 'cc',
                            },
                            { name: 'Cuenta vista', id: 'cv' },
                          ]}
                          setOption={createChangeHandler('account_type')}
                        ></ComboBox>
                        {errors.account_type && (
                          <p className="text-left text-xs italic text-red-500">
                            {errors.account_type.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="account-number"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Número de cuenta
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          name="account_number"
                          id="account_number"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={form.account_number}
                          onChange={onChangeNumeric}
                        />
                      </div>
                      {errors.account_number && (
                        <p className="text-left text-xs italic text-red-500">
                          {errors.account_number.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="bank_email"
                        className="block text-sm font-semibold text-gray-900"
                      >
                        Mail
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          name="bank_email"
                          id="bank_email"
                          value={form.bank_email}
                          onChange={onChange}
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.bank_email && (
                          <p className="text-left text-xs italic text-red-500">
                            {errors.bank_email.message}
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
                      ¡Empezar a cobrar!
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Nos comprometemos a no compartir tus datos con nadie.
                  </p>
                </form>
                <div className="lg:mt-6 lg:w-80 lg:flex-none">
                  <img
                    className="h-12 w-auto"
                    src={`${router.basePath}/logos/logo.svg`}
                    alt=""
                  />
                  <figure className="mt-10">
                    <blockquote className="text-lg font-semibold leading-8 text-gray-900">
                      <p>
                        “Buscamos que nuestros clientes se enfoquen en su
                        negocio principal y crezcan de manera segura, sin perder
                        tiempo en la gestión de cobros ni incurrir en costos
                        adicionales asociados.”
                      </p>
                    </blockquote>
                    <figcaption className="mt-10 flex gap-x-6">
                      <img
                        src={`${router.basePath}/assets/images/nico.jpeg`}
                        alt=""
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      />
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          Nicolás Camhi
                        </div>
                        <div className="text-sm leading-6 text-gray-600">
                          CEO de Vambe
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Main>
    </>
  );
};

export default Onboarding;
