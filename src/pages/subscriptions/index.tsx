import { PlusSmallIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useQuery } from 'react-query';

import NavBar from '@/components/navbar';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import getGroupSubscriptions from '@/utils/api/subscriptions/getGroupSubscriptions';
import getSubscriptionStats from '@/utils/api/subscriptions/getSubscriptionStats';
import classNames from '@/utils/functions/classNames';

import type { ApiProfile } from '@/utils/api/users/getProfile';
import Table from '@/components/tickets-subscriptions/table';
import withAuth from '../../components/withAuth';

type SubscriptionDashboardProps = {
  profile?: ApiProfile;
  accessToken?: string;
};

const SubscriptionsDashboard: React.FC<SubscriptionDashboardProps> = ({
  profile,
  accessToken,
}) => {
  const { isLoading: statsLoading, data: stats } = useQuery(
    ['subscriptionStats', accessToken],
    () => getSubscriptionStats(String(accessToken)),
    {
      enabled: !!accessToken, // only run the query if the accessToken is available
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  const {
    isLoading: groupedSubscriptionsLoading,
    data: days,
    refetch: refetchDays,
  } = useQuery(
    ['groupedSubscriptions', accessToken],
    () => getGroupSubscriptions(String(accessToken)),
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
            statsLoading || groupedSubscriptionsLoading ? 'animate-pulse' : ''
          }
        >
          <div className="relative isolate overflow-hidden pt-16">
            {/* Secondary navigation */}
            <header className="pb-4 pt-6 sm:pb-6">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                <h1 className="text-base font-semibold leading-7 text-gray-900">
                  Ingresos por suscripciones
                </h1>

                <Link
                  href="/subscriptions/create"
                  className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <PlusSmallIcon
                    className="-ml-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Nueva suscripción
                </Link>
              </div>
            </header>

            {/* Stats */}
            <div
              className={classNames(
                statsLoading ? 'animate-pulse' : '',
                'border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5 hidden md:block' // Added 'hidden md:block'
              )}
            >
              <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
                {Array.isArray(stats) &&
                  stats?.map((stat, statIdx) => (
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
            {!groupedSubscriptionsLoading && days && accessToken && profile ? (
              <Table
                subscriptions={days}
                accessToken={accessToken}
                refetch={refetchDays}
                profile={profile}
              ></Table>
            ) : null}
          </div>
        </main>
      </Main>
    </>
  );
};

export default withAuth(SubscriptionsDashboard);
