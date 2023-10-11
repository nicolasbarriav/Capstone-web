import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { useQuery } from 'react-query';

import EditClientModal from '@/components/editClientModal';
import NavBar from '@/components/navbar';
import Table from '@/components/tickets-table/table';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import getDebtorInfo from '@/utils/api/debtors/getDebtorInfo';
import getGroupTickets from '@/utils/api/tickets/getGroupTickets';
import getTicketStats from '@/utils/api/tickets/getTicketStats';
import type { ApiProfile } from '@/utils/api/users/getProfile';
import classNames from '@/utils/functions/classNames';

import withAuth from '../../components/withAuth';

type DashboardProps = {
  profile?: ApiProfile;
  accessToken?: string;
};

const DebtorShow: React.FC<DashboardProps> = ({ profile, accessToken }) => {
  const router = useRouter();
  const { id } = router.query;
  const [openEditModal, setOpenEditModal] = useState(false);
  const debtor = useQuery(
    ['debtor', accessToken, id],
    () => getDebtorInfo(String(accessToken), router.query.id as string),
    {
      enabled: !!accessToken && !!id, // only run the query if the accessToken is available
    }
  );

  const { isLoading: statsLoading, data: stats } = useQuery(
    ['ticketStats', accessToken, debtor],
    () => getTicketStats(String(accessToken), debtor.data?.id),
    {
      enabled: !!accessToken, // only run the query if the accessToken is available
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  const {
    isLoading: groupedTicketsLoading,
    data: days,
    refetch: refetchDays,
  } = useQuery(
    ['groupedTickets', accessToken, debtor.data],
    () => getGroupTickets(String(accessToken), debtor.data?.id),
    {
      enabled: !!accessToken, // only run the query if the accessToken is available
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  function getStatDisplayName(name: string): string | null {
    const displayNames: Record<string, string> = {
      total: 'Total',
      paid: 'Pagado',
      to_due: 'Por vencer',
      expired: 'Vencido',
    };

    return displayNames[name] || null;
  }

  function getBorderStyleClass(statIdx: number) {
    if (statIdx % 2 === 1) {
      return 'sm:border-l';
    }
    if (statIdx === 2) {
      return 'lg:border-l';
    }
    return '';
  }

  return (
    <>
      <Main meta={<Meta title="vambe" description="" />}>
        <NavBar />
        <main
          className={
            statsLoading || groupedTicketsLoading ? 'animate-pulse' : ''
          }
        >
          <div className="relative isolate overflow-hidden pt-16">
            {/* Secondary navigation */}
            <header className="pb-4 pt-6 sm:pb-6">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                <h1 className="text-base font-semibold leading-7 text-gray-900">
                  Movimientos de {debtor.data?.name}
                </h1>
                <Menu
                  as="div"
                  className="relative ml-auto flex flex-none items-center gap-x-1 px-3 py-2"
                >
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
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => setOpenEditModal(true)}
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                            )}
                          >
                            Editar cliente
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </header>

            {/* Stats */}
            <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
              <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
                {stats?.map((stat, statIdx) => (
                  <div
                    key={stat.name}
                    className={classNames(
                      getBorderStyleClass(statIdx),
                      'sm:border-l flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8'
                    )}
                  >
                    <dt className="text-sm font-medium leading-6 text-gray-500">
                      {getStatDisplayName(stat.name)}
                    </dt>
                    <dd
                      className={classNames(
                        stat.change_type === 'negative'
                          ? 'text-rose-600'
                          : 'text-gray-700',
                        'text-xs font-medium'
                      )}
                    >
                      {stat.change}
                    </dd>
                    <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

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

          <div className="mx-auto my-4 flex max-w-7xl flex-wrap items-center gap-6 px-8 sm:flex-nowrap sm:px-6 lg:px-24">
            {!groupedTicketsLoading && days && accessToken && profile ? (
              <Table
                tickets={days}
                accessToken={accessToken}
                refetch={refetchDays}
                profile={profile}
              ></Table>
            ) : null}
          </div>
        </main>
      </Main>
      {debtor.data ? (
        <EditClientModal
          open={openEditModal}
          setOpen={setOpenEditModal}
          debtor={debtor.data}
        ></EditClientModal>
      ) : null}
    </>
  );
};

export default withAuth(DebtorShow);
