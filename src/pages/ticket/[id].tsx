import { Menu, Transition } from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { useQuery } from 'react-query';

import NavBar from '@/components/navbar';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import createTicketState from '@/utils/api/tickets/createTicketState';
import deleteTicket from '@/utils/api/tickets/deleteTicket';
import getTicketById from '@/utils/api/tickets/getTicketById';
import { statuses } from '@/utils/constants/statuses';
import capitalizeFirstLetter from '@/utils/functions/capitalizeFirstLetter';
import classNames from '@/utils/functions/classNames';

import withAuth from '../../components/withAuth';

type ShowTicketProps = {
  accessToken?: string;
};

const Dashboard: React.FC<ShowTicketProps> = ({ accessToken }) => {
  const router = useRouter();
  const { id } = router.query;

  const ticket = useQuery(
    ['ticket', id, accessToken],
    () => getTicketById(String(id), String(accessToken)),
    {
      enabled: !!accessToken && !!id,
      staleTime: 1000 * 60 * 5,
    }
  );

  return (
    <>
      <Main meta={<Meta title="vambe" description="" />}>
        <NavBar />
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden p-20 lg:p-24">
          <div className="px-4 sm:px-0">
            <div className="flex flex-row justify-between">
              <div className="">
                <p>#{ticket.data?.id}</p>
                <h3 className="text-2xl font-semibold leading-7 text-gray-900">
                  {ticket.data?.title}
                </h3>
                <dd className="mt-1 text-sm  text-gray-700 sm:mt-2">
                  {ticket.data?.debtorName}
                </dd>
              </div>
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <PencilSquareIcon
                    className="h-7 w-7 text-indigo-600"
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
                    {ticket.data?.status &&
                    ticket.data?.status !== 'manually_paid' ? (
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() =>
                              createTicketState(
                                ticket.data?.id,
                                'manually_paid',
                                String(accessToken)
                              )
                            }
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                            )}
                          >
                            Marcar como pagado
                          </div>
                        )}
                      </Menu.Item>
                    ) : null}
                    {ticket.data?.status &&
                    ticket.data?.status !== 'canceled' ? (
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() =>
                              createTicketState(
                                ticket.data?.id,
                                'canceled',
                                String(accessToken)
                              )
                            }
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                            )}
                          >
                            Anular ticket
                          </div>
                        )}
                      </Menu.Item>
                    ) : null}
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={() => {
                            deleteTicket(ticket.data?.id, String(accessToken));
                            router.push('/dashboard');
                          }}
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                          )}
                        >
                          Eliminar ticket
                        </div>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <div className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Descripción
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {ticket.data?.description}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Comentario Interno
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {ticket.data?.internalComment}
                </dd>
              </div>

              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Cantidad a pagar
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {ticket.data?.amount} {ticket.data?.currency}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Fecha creación
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {ticket.data?.createdAt &&
                    format(ticket.data?.createdAt, 'dd-MM-yyyy')}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Fecha de vencimiento
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {ticket.data?.paymentDueAt &&
                    format(ticket.data?.paymentDueAt, 'dd-MM-yyyy')}
                </dd>
              </div>

              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-semibold leading-6 text-gray-900">
                  Cambios de estado
                </dt>
                <ul role="list" className="divide-y divide-gray-100">
                  {ticket.data?.statuses.map((status) => (
                    <li
                      key={status.id}
                      className="flex items-center justify-between gap-x-6 py-5"
                    >
                      <div className="min-w-0">
                        <div className="flex items-start gap-x-3">
                          <p className="text-xs font-semibold leading-6 text-gray-900">
                            Estado:
                          </p>
                          <p
                            className={classNames(
                              status.status in statuses
                                ? statuses[status.status]?.color || ''
                                : '',
                              'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                            )}
                          >
                            {status.status in statuses
                              ? statuses[status?.status]?.name
                              : status.status}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                          <p className="whitespace-nowrap">
                            Fecha del estado:{' '}
                            <time dateTime={status.createdAt.toDateString()}>
                              {format(status.createdAt, 'dd-MM-yyyy')}
                            </time>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-semibold leading-6 text-gray-900">
                  Notificaciones
                </dt>
                <ul role="list" className="divide-y divide-gray-100">
                  {ticket.data?.remainders.map((remainder) => (
                    <li
                      key={remainder.id}
                      className="flex items-center justify-between gap-x-6 py-5"
                    >
                      <div className="min-w-0">
                        <div className="flex items-start gap-x-3">
                          <p className="text-xs font-semibold leading-6 text-gray-900">
                            {capitalizeFirstLetter(remainder.type)}
                          </p>
                          <p
                            className={classNames(
                              remainder.sent
                                ? 'text-green-600 bg-green-50 ring-green-600/20'
                                : 'text-yellow-600 bg-yellow-50 ring-yellow-600/20',
                              'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                            )}
                          >
                            {remainder.sent ? 'Enviado' : 'Por enviar'}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                          <p className="whitespace-nowrap">
                            Fecha notificación:{' '}
                            <time
                              dateTime={remainder.notificationDate.toDateString()}
                            >
                              {format(remainder.notificationDate, 'dd-MM-yyyy')}
                            </time>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </dl>
          </div>
        </div>
      </Main>
    </>
  );
};

export default withAuth(Dashboard);
