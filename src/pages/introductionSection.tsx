import { useRouter } from 'next/router';

export default function IntroductionSection() {
  const router = useRouter();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="relative" id="start">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pb-0 sm:pb-32 sm:pt-10 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-32 xl:col-span-6">
          <div className="mx-auto max-w-2xl sm:px-24 lg:mx-0">
            <h1 className="mt-24 text-4xl font-bold leading-tight tracking-tight text-black sm:mt-10 sm:text-6xl">
              Simplifica y automatiza la cobranza.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-900">
              Notifica a tus deudores, concilia los pagos y mejora la
              comunicación con tus clientes.
            </p>
            <div className="mt-10 flex h-14 items-center gap-x-6 lg:h-10">
              <button
                className="h-full rounded-md bg-indigo-600 px-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  router.push('/signup');
                }}
              >
                Comienza GRATIS
              </button>
              <button
                className="h-full rounded-md border border-gray-900 px-2 text-sm font-semibold leading-6 text-gray-900"
                onClick={() => {
                  scrollToSection('howItWorks');
                }}
              >
                ¿Cómo funciona?
              </button>
            </div>
          </div>
        </div>
        <div className="hidden items-center justify-center p-8 md:block lg:col-span-5 lg:py-32">
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-50 py-16 shadow-xl lg:py-0">
            <img
              className="w-3/4 lg:aspect-auto"
              src={`${router.basePath}/logos/vambeLogo.svg`}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
