import { useRouter } from 'next/router';

export default function JoinUs() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center pb-16" id="contact">
      <div className="relative mx-auto grid h-full w-4/5 max-w-2xl grid-cols-1 rounded-xl bg-white shadow-xl lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div className="absolute -bottom-2 flex h-2 w-full justify-center">
          <div className="h-full w-11/12 rounded-b-lg bg-gray-300 shadow-sm"></div>
        </div>
        <div className="flex h-full flex-col items-center justify-center px-4 py-2 sm:px-16 md:py-10">
          <div className="flex flex-col justify-center lg:max-w-lg">
            <img
              className="mb-8 w-full px-8 sm:mb-16 sm:w-1/2 sm:px-0 lg:aspect-auto"
              src={`${router.basePath}/logos/vambeLogo.svg`}
              alt=""
            />
            <p className="my-2 text-3xl font-bold leading-snug tracking-tight text-gray-900 sm:text-4xl">
              ¿Qué esperas?
            </p>
            <p className="text-base leading-snug text-gray-900">
              Sé uno de nuestros primeros usuarios y construyamos juntos la
              mejor solución del mercado.
            </p>
            <div className="mt-4">
              <button
                className="h-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  router.push('/signup');
                }}
              >
                Inscríbete aquí
              </button>
            </div>
          </div>
        </div>
        <div className="h-full py-8">
          <div className="flex flex-col px-4 sm:px-16">
            <div className="border-b border-gray-300 pb-4 sm:pb-0">
              <p className="mt-2 w-16 text-xl font-bold leading-snug tracking-tight text-gray-900 sm:text-2xl">
                Precios Exclusivos
              </p>
              <p className="text-xs leading-snug text-gray-600 sm:my-4 sm:pr-32">
                Sé uno de nuestros primeros usuarios y aprovecha precios
                exclusivos.
              </p>
            </div>
            <div className="border-b border-gray-300 pb-4 sm:pb-0">
              <p className="mt-2 w-32 text-xl font-bold leading-snug tracking-tight text-gray-900 sm:text-2xl">
                Construimos para ti
              </p>
              <p className="text-xs leading-snug text-gray-600 sm:my-4 sm:pr-32">
                Tomaremos todo tipo de feedback y crearemos las funcionalidades
                que más necesites.
              </p>
            </div>
            <div>
              <p className="mt-2 w-16 text-xl font-bold leading-snug tracking-tight text-gray-900 sm:text-2xl">
                Hagamos comunidad
              </p>
              <p className="text-xs leading-snug text-gray-600 sm:my-4 sm:pr-32">
                Serás parte de la red de nuestros primeros clientes, una
                comunidad donde nos ayudaremos entre todos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
