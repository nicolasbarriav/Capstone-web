import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { BuildingLibraryIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';

const VambeBankAccount = () => {
  const [copiedStatus, setCopiedStatus] = useState<{ [key: string]: boolean }>({
    razonSocial: false,
    rut: false,
    banco: false,
    tipoCuenta: false,
    numeroCuenta: false,
    allData: false,
  });

  const copyToClipboard = (text: string, key: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopiedStatus((prevState) => ({ ...prevState, [key]: true }));
  };

  const copyAllDataToClipboard = () => {
    const allData = `Vambe SpA
77736936-9
Banco BICE
Cuenta Corriente
24002969`;
    copyToClipboard(allData, 'allData'); // Utiliza la función existente
  };

  useEffect(() => {
    const keys = Object.keys(copiedStatus);
    for (const key of keys) {
      if (copiedStatus[key as keyof typeof copiedStatus]) {
        setTimeout(() => {
          setCopiedStatus((prevState) => ({ ...prevState, [key]: false }));
        }, 1000);
      }
    }
  }, [copiedStatus]);

  return (
    <Main meta={<Meta title="vambe" description="Datos bancarios" />}>
      <div className="flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="m-5 w-full max-w-xl overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="flex items-center justify-between px-4 py-6 sm:px-6">
            <div className="flex items-center">
              <BuildingLibraryIcon
                className="h-7 w-7 text-gray-400"
                aria-hidden="true"
              />
              <h3 className="ml-2 text-2xl font-semibold text-gray-900">
                Cuenta Vambe
              </h3>
            </div>
          </div>

          <div>
            <dl className="divide-y divide-gray-300 px-4">
              {/* Razón social */}
              <div className="grid grid-cols-1 px-4 py-6 sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="mt-1 text-sm font-medium text-gray-900">
                  Razón social
                </dt>
                <dd className="mt-1 flex items-center justify-between text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  Vambe SpA
                  <button
                    onClick={() => copyToClipboard('Vambe SpA', 'razonSocial')}
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  >
                    {copiedStatus.razonSocial ? '¡Copiado!' : 'Copiar'}
                  </button>
                </dd>
              </div>
              {/* Rut */}
              <div className="grid grid-cols-1 px-4 py-6 sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="mt-1 text-sm font-medium text-gray-900">Rut</dt>
                <dd className="mt-1 flex items-center justify-between text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  77.736.936-9
                  <button
                    onClick={() => copyToClipboard('77736936-9', 'rut')}
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  >
                    {copiedStatus.rut ? '¡Copiado!' : 'Copiar'}
                  </button>
                </dd>
              </div>
              {/* Banco */}
              <div className="grid grid-cols-1 px-4 py-6 sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="mt-1 text-sm font-medium text-gray-900">
                  Banco
                </dt>
                <dd className="mt-1 flex items-center justify-between text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  Banco BICE
                  <button
                    onClick={() => copyToClipboard('Banco BICE', 'banco')}
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  >
                    {copiedStatus.banco ? '¡Copiado!' : 'Copiar'}
                  </button>
                </dd>
              </div>
              {/* Tipo de cuenta */}
              <div className="grid grid-cols-1 px-4 py-6 sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="mt-1 text-sm font-medium text-gray-900">
                  Tipo de cuenta
                </dt>
                <dd className="mt-1 flex items-center justify-between text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  Cuenta Corriente
                  <button
                    onClick={() =>
                      copyToClipboard('Cuenta Corriente', 'tipoCuenta')
                    }
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  >
                    {copiedStatus.tipoCuenta ? '¡Copiado!' : 'Copiar'}
                  </button>
                </dd>
              </div>
              {/* Numero de cuenta */}
              <div className="grid grid-cols-1 px-4 py-6 sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="mt-1 text-sm font-medium text-gray-900">
                  Numero de cuenta
                </dt>
                <dd className="mt-1 flex items-center justify-between text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  24-00296-9
                  <button
                    onClick={() => copyToClipboard('24002969', 'numeroCuenta')}
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  >
                    {copiedStatus.numeroCuenta ? '¡Copiado!' : 'Copiar'}
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <button
          onClick={copyAllDataToClipboard}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {copiedStatus.allData
            ? '¡Todos los datos copiados!'
            : 'Copiar todos los datos'}
        </button>
      </div>
    </Main>
  );
};

export default VambeBankAccount;
