import { useRouter } from 'next/router';

export default function HowDoesItWork() {
  const router = useRouter();
  return (
    <div
      className="mb-16 flex w-full flex-col items-center justify-center px-8 lg:px-32"
      id="howItWorks"
    >
      <p className="mb-4 mt-2 text-center text-2xl font-bold leading-snug tracking-tight text-gray-900">
        Tickets automáticos de cobranza que notifican y le hacen seguimiento al
        cliente.
      </p>
      <p className="mb-4 text-center text-sm">
        Crea tickets en menos de 30 segundos y despreocúpate, cada ticket se
        encargará de notificar al cliente en el minuto oportuno y, además, te
        entregará información valiosa de la cuenta por cobrar.
      </p>
      <div className="relative mb-8 flex w-full flex-col items-center justify-center rounded-xl bg-gray-200 p-2 shadow-xl sm:w-4/5">
        <img
          src={`${router.basePath}/assets/images/mainLanding/howDoesItWork.png`}
          alt="Product screenshot"
          className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10"
        />
        <button
          className="absolute bottom-0 mt-4 hidden h-10 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:bottom-8 sm:block"
          onClick={() => {
            router.push('/signup');
          }}
        >
          Súmate ahora
        </button>
      </div>
      <button
        className="h-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:hidden"
        onClick={() => {
          router.push('/signup');
        }}
      >
        Súmate ahora
      </button>
    </div>
  );
}
