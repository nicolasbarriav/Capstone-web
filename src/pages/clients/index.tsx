// import { Menu, Transition } from '@headlessui/react';
// import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';

import NavBar from '@/components/navbar';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import getDebtorsStats from '@/utils/api/debtors/getDebtorsStats';
import type { ApiProfile } from '@/utils/api/users/queries/get-profile.query';
// import classNames from '@/utils/functions/classNames';

import { useQuery } from 'react-query';
import withAuth from '../../components/withAuth';

// POR NOSOTROS DE ACA EN ADELANTE
import Table from '@/components/clients-table/table';
import getGroupTickets from '@/utils/api/tickets/getGroupTickets';
// ACA TERMINA LO QUE AGREGAMOS

type DashboardProps = {
  accessToken?: string;
  profile?: ApiProfile;
};
const DebtorsDashboard: React.FC<DashboardProps> = ({ accessToken, profile }) => {
  const secondaryNavigation = [
    { name: 'Últimos 7 días', value: '7' },
    { name: 'Últimos 30 días', value: '30' },
    { name: 'Histórico', value: '' },
  ];
  const [pickedNavigation, setPickedNavigation] = useState({
    name: 'Últimos 7 días',
    value: '7',
  });
  
  const {
    isLoading: debtorsLoading,
    data: debtorStats,
    refetch: refetchDebtor,
  } = useQuery(
    ['debtorStats', accessToken, pickedNavigation.value],
    () => getDebtorsStats(String(accessToken), pickedNavigation.value),
    {
      enabled: !!accessToken, // only run the query if the accessToken is available
    }
  );
  
  const {
    isLoading: ticketsLoading,
    data: debtorTickets,
    refetch: refetchTicket,
  } = useQuery(
    ['debtorTickets', accessToken],
    () => getGroupTickets(String(accessToken)),
    {
      enabled: !!accessToken, // only run the query if the accessToken is available
    }
  );

  return (
    <>
      <Main meta={<Meta title="vambe" description="" />}>
        <NavBar />
        <main>
          <div className="relative isolate overflow-hidden pt-16">
            {/* Secondary navigation */}
            <header className="pb-4 pt-6 sm:pb-6">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                <h1 className="text-base font-semibold leading-7 text-gray-900">
                  Movimientos
                </h1>
                <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
                  {secondaryNavigation.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => {
                        setPickedNavigation(item);
                      }}
                      className={
                        item.name === pickedNavigation.name
                          ? 'cursor-pointer text-indigo-600'
                          : 'cursor-pointer text-gray-700'
                      }
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </header>

            <div
              className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
              aria-hidden="true"
            >
              <div
                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#3533C9] to-[#BCBCBC]"
                style={{
                  clipPath:
                    'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                }}
              />
            </div>
          </div>

          <div className="space-y-16 py-16 xl:space-y-20">
            {/* Recent debtor list */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Clientes
                  </h2>
                </div>
                
                  
                  {!debtorsLoading && !ticketsLoading && debtorTickets && debtorStats && accessToken && profile ? (
                    <Table
                      debtors={debtorStats}
                      tickets={debtorTickets}
                      accessToken={accessToken}
                      refetch={refetchDebtor} // & refetchTicket (?)
                      profile={profile}
                  ></Table>
                  ) : null}
                  
                  {/* {debtorStats.data?.map((debtor) => (
                    <li
                      key={debtor.id}
                      className="overflow-hidden rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                        <div className="text-sm font-medium leading-6 text-gray-900">
                          {debtor.name}
                        </div>
                        <Menu as="div" className="relative ml-auto">
                          <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Open options</span>
                            <EllipsisHorizontalIcon
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
                            <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href={`/clients/${debtor.id}`}
                                    className={classNames(
                                      active ? 'bg-gray-50' : '',
                                      'block px-3 py-1 text-sm leading-6 text-gray-900'
                                    )}
                                  >
                                    Ver
                                    <span className="sr-only">
                                      , {debtor.name}
                                    </span>
                                  </a>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Último ticket</dt>
                          <dd className="text-gray-700">
                            <time dateTime={debtor.last_ticket_date}>
                              {debtor.last_ticket_date}
                            </time>
                          </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Total</dt>
                          <dd className="flex items-start gap-x-2">
                            <div className="font-medium text-gray-900">
                              {debtor.total}
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Pagado</dt>
                          <dd className="flex items-start gap-x-2">
                            <div className="font-medium text-gray-900">
                              {debtor.paid}
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Por vencer</dt>
                          <dd className="flex items-start gap-x-2">
                            <div className="font-medium text-gray-900">
                              {debtor.to_due}
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Vencido</dt>
                          <dd className="flex items-start gap-x-2">
                            <div className="font-medium text-gray-900">
                              {debtor.expired}
                            </div>
                          </dd>
                        </div>
                      </dl>
                    </li>
                  ))} */}
              </div>
            </div>
          </div>
        </main>
      </Main>
    </>
  );
};

export default withAuth(DebtorsDashboard);
