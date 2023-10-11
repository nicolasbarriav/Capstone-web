import { useRouter } from 'next/router';

export default function SaveTimeCard() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center pb-16">
      <div className="relative mx-auto grid h-full w-4/5 max-w-2xl grid-cols-1 rounded-xl bg-white shadow-xl lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div className="absolute -bottom-2 flex h-2 w-full justify-center">
          <div className="h-full w-11/12 rounded-b-lg bg-gray-300 shadow-sm"></div>
        </div>
        <div className="flex h-full flex-col items-center justify-center px-4 py-8 sm:px-16">
          <div className="lg:max-w-lg">
            <p className="mt-2 text-3xl font-bold leading-snug tracking-tight text-gray-900 sm:text-4xl">
              Ahorra tiempo en conciliación bancaria.
            </p>
            <p className="text-base leading-8 text-gray-600">
              Nosotros procesamos los pagos por ti y sabrás instantáneamente qué
              facturas están pagadas y cuáles siguen pendientes.
            </p>
            <div className="mt-4">
              <button
                className="inline-flex rounded-md border border-gray-900 px-3.5 py-2.5 text-sm font-semibold shadow-sm"
                onClick={() => {
                  router.push('/signup');
                }}
              >
                Inscríbete gratis
              </button>
            </div>
          </div>
        </div>
        <div className="h-full">
          <img
            src={`${router.basePath}/assets/images/mainLanding/data.jpg`}
            alt="Product screenshot"
            className="w-full max-w-none rounded-b-xl shadow-xl ring-1 ring-gray-400/10 lg:rounded-r-xl lg:rounded-bl-none"
          />
        </div>
      </div>
    </div>
  );
}
