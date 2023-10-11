import { format } from 'date-fns';

import NavBar from '@/components/navbar';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import getTransactions from '@/utils/api/payments/getTransactions';

import formatCurrency from '@/utils/functions/formatCurrency';
import withAuth from '@/components/withAuth';
import { useQuery } from 'react-query';

type Props = {
  accessToken?: string;
};
const Transactions: React.FC<Props> = ({ accessToken }) => {
  const transactions = useQuery(
    ['transactions', accessToken],
    () => getTransactions(String(accessToken)),
    {
      enabled: !!accessToken, // only run the query if the accessToken is available
    }
  );

  return (
    <Main meta={<Meta title="vambe" description="" />}>
      <div className="h-16">
        <NavBar />
      </div>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Transferencias
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Aquí podrás ver todas las transferencias que hemos realizado a tu
              cuenta.
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Monto
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Ticket(s) correspondiente(s)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transactions.data?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        {format(new Date(transaction.created_at), 'dd-MM-yyyy')}
                      </td>
                      <td className="whitespace-nowrap p-2 text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="whitespace-nowrap p-2 text-sm text-gray-900">
                        {transaction.vambe_payment_tickets
                          .map(
                            (ticket) =>
                              `#${ticket.ticket_id} ${ticket.ticket.title}`
                          )
                          .join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default withAuth(Transactions);
