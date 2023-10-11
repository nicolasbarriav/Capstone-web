import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import { auth } from '../utils/firebase'; // Import Firebase auth

const PasswordReset = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [mailSent, setMailSent] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard'); // Redirect to the dashboard or any protected route
    }
  }, [user, router]);

  const passwordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as any).email.value as string;

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      // console.error(error);
    }
    setMailSent(true);
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-indigo-600"
          style={{ borderTopColor: 'currentColor' }}
        ></div>
      </div>
    );

  return (
    <Main meta={<Meta title="vambe" description="" />}>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-24 w-auto"
            src={`${router.basePath}/logos/logo.svg`}
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Recupera tu contraseña 🔐
          </h2>
          {!mailSent ? (
            <h3 className="mt-4 text-center text-sm font-bold tracking-tight text-gray-900">
              Escribe el email asociado a tu cuenta
            </h3>
          ) : null}
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            {!mailSent ? (
              <form
                className="space-y-6"
                action="#"
                method="POST"
                onSubmit={passwordReset}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Continuar
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="text-center text-sm tracking-tight text-gray-900">
                  Si tu correo está en nuestra base de datos, te enviaremos las
                  instrucciones necesarias para recuperar tu contraseña.
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default PasswordReset;
