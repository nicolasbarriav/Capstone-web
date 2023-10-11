import { Menu, Transition } from '@headlessui/react';
import {
  ArrowPathIcon,
  ArrowUpCircleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

import NavBar from '@/components/navbar';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import changeSubscriptionState from '@/utils/api/subscriptions/changeSubscriptionState';
import deleteSubscription from '@/utils/api/subscriptions/deleteSubscription';
import getSubscriptionInfo from '@/utils/api/subscriptions/getSubscriptionInfo';
import englishToSpanish from '@/utils/constants/englishToSpanish';
import { statuses } from '@/utils/constants/statuses';
import classNames from '@/utils/functions/classNames';

import { useQuery } from 'react-query';
import getTicketsBySubscription from '@/utils/api/tickets/getTicketsBySubscription';
import withAuth from '../../components/withAuth';

type SubscriptionShowProps = {
  accessToken?: string;
};

const SubscriptionShow: React.FC<SubscriptionShowProps> = ({ accessToken }) => {
  const router = useRouter();
  const { id } = router.query;

  const subscription = useQuery(
    ['subscriptionInfo', accessToken, String(id)],
    () => getSubscriptionInfo(String(accessToken), id as string),
    {
      enabled: !!accessToken && !!id,
    }
  );
  const tickets = useQuery(
    ['subscription', 'tickets', accessToken, String(id)],
    () => getTicketsBySubscription(String(id), String(accessToken)),
    {
      enabled: !!accessToken && !!id,
    }
  );

  return (
    <>
      <Main meta={<Meta title="vambe" description="" />}>
        <NavBar />
        <main className="mx-auto max-w-5xl">
          <div className="relative isolate overflow-hidden p-20 lg:p-24">
            <div className="px-4 sm:px-0">
              <div className="flex flex-row justify-between">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  {subscription.data?.title}
                </h3>
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {subscription.data?.status === 'active' ? (
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={() =>
                                changeSubscriptionState(
                                  subscription.data?.id,
                                  String(accessToken),
                                  'canceled',
                                  false
                                )
                              }
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                              )}
                            >
                              Desactivar plan
                            </div>
                          )}
                        </Menu.Item>
                      ) : (
                        ''
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              deleteSubscription(
                                subscription.data?.id,
                                String(accessToken)
                              );
                              router.push('/subscriptions');
                            }}
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                            )}
                          >
                            Eliminar suscripción
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                {subscription.data?.description}
              </p>
            </div>
            <div className="mt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2">
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Cliente
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {subscription.data?.debtorName}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Cantidad a pagar
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {subscription.data?.currency} {subscription.data?.amount}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Frencuencia
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {subscription.data
                      ? englishToSpanish(subscription.data?.frecuency)
                      : ''}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Cantidad de cobros
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {subscription.data
                      ? subscription.data.totalCycles -
                        subscription.data.remainingCycles
                      : ''}
                    /{subscription.data?.totalCycles} cuotas emitidas
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Fecha creación
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {subscription.data
                      ? format(
                          new Date(subscription.data.createdAt),
                          'dd-MM-yyyy'
                        )
                      : ''}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Fecha comienzo
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {subscription.data
                      ? format(subscription.data.startDate, 'dd-MM-yyyy')
                      : ''}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-semibold leading-6 text-gray-900">
                Historial de tickets
              </dt>
              <table className="w-full text-left">
                <thead className="sr-only">
                  <tr>
                    <th>Amount</th>
                    <th className="hidden sm:table-cell">debtor</th>
                    <th>More details</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.data?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="relative py-5 pr-6">
                        <div className="flex gap-x-6">
                          {['paid', 'settled', 'manually_paid'].includes(
                            String(transaction.status)
                          ) ? (
                            <ArrowUpCircleIcon
                              className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                              aria-hidden="true"
                            />
                          ) : (
                            <ArrowPathIcon
                              className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                              aria-hidden="true"
                            />
                          )}
                          <div className="flex-auto">
                            <div className="flex items-start gap-x-3">
                              <div className="text-sm font-medium leading-6 text-gray-900">
                                {transaction.amount}
                              </div>
                              <div
                                className={classNames(
                                  String(transaction.status) in statuses
                                    ? statuses[String(transaction.status)]
                                        ?.color || ''
                                    : '',
                                  'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                                )}
                              >
                                {String(transaction.status) in statuses
                                  ? statuses[String(transaction.status)]?.name
                                  : transaction.status}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 flex items-start gap-x-3 text-xs leading-5 text-gray-500">
                          Fecha vencimiento:{' '}
                          {transaction.paymentDueAt
                            ? format(
                                new Date(transaction.paymentDueAt),
                                'dd-MM-yyyy'
                              )
                            : ''}
                        </div>
                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                      </td>
                      <td className="hidden py-5 pr-6 sm:table-cell">
                        <div className="text-sm leading-6 text-gray-900">
                          {transaction.debtorName}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-gray-500">
                          {transaction.title}
                        </div>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex justify-end">
                          <Link
                            href={`/ticket/${transaction.id}`}
                            className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                          >
                            Ver
                            <span className="hidden sm:inline"> ticket</span>
                            <span className="sr-only">
                              , ticket #{transaction.id},{' '}
                              {transaction.debtorName}
                            </span>
                          </Link>
                        </div>
                        <div className="mt-1 text-xs leading-5 text-gray-500">
                          Ticket{' '}
                          <span className="text-gray-900">
                            #{transaction.id}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </Main>
    </>
  );
};

export default withAuth(SubscriptionShow);
