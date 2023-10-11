import router from 'next/router';

const tiers = [
  {
    name: 'Transacción',
    id: 'transaction',
    href: '#',
    priceMonthly: '$1.000',
    features: [
      'Costo fijo muy bajo por uso de pasarela de pago rápido, para que el porcentaje de altos montos no baje tu rentabilidad.',
    ],
    mostPopular: false,
    by: 'ticket',
  },
  {
    name: 'Mensualidad',
    id: 'monthly',
    href: '#',
    priceMonthly: '$0',
    features: ['No cobramos mensualidad, es un servicio on-demand.'],
    mostPopular: true,
  },
  {
    name: 'Extras',
    id: 'extras',
    href: '#',
    priceMonthly: '$0',
    features: [
      'No cobramos por usuarios extras, ticket extras, cuentas bancarias extras ni nada por el estilo.',
    ],
    mostPopular: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
  return (
    <div className="mb-8 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Precios
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Una tarifa plana, simple y fácil de entender, que te permite hacer
          toda la cobranza de tu empresa en una sola plataforma y sin límites.
        </p>
        <div className="isolate mx-auto mt-8 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'lg:z-10 sm:-mb-8' : 'lg:mt-8',
                tierIdx === 0 ? 'lg:rounded-r-none' : '',
                tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 shadow-xl'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={classNames(
                      'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.priceMonthly}
                  </span>
                  {tier.by === 'ticket' ? (
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /ticket
                    </span>
                  ) : (
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /mes
                    </span>
                  )}
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {tier.id === 'monthly' && (
                <button
                  aria-describedby={tier.id}
                  onClick={() => {
                    router.push('/signup');
                  }}
                  className={classNames(
                    tier.mostPopular
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                      : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  )}
                >
                  Comienza YA
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
