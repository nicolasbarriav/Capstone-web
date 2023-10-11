import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import createTicketState from '@/utils/api/tickets/createTicketState';
import deleteTicket from '@/utils/api/tickets/deleteTicket';
import type { Ticket } from '@/utils/api/tickets/domain/ticket';
import type { ApiProfile } from '@/utils/api/users/queries/get-profile.query';
import { statuses } from '@/utils/constants/statuses';
import classNames from '@/utils/functions/classNames';
import formatCurrency from '@/utils/functions/formatCurrency';
import getBankName from '@/utils/functions/getBankName';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
};

export const getColumns = (
  accessToken: string,
  refetch: () => void,
  profile: ApiProfile
): ColumnDef<Ticket>[] => [
  ...(profile.admin
    ? [
        {
          id: 'select',
          header: ({ table }: any) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }: any) => (
            <>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            </>
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          id: 'Cliente VAMBE',
          accessorFn: (row: any) =>
            `${row.creditor.first_name} ${row.creditor.last_name} +${row.creditor.phone}`,
          header: ({ column }: any) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
              >
                Cliente VAMBE
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }: any) => (
            <div className="capitalize">{row.getValue('Cliente VAMBE')}</div>
          ),
        },
      ]
    : []),
  {
    id: 'Estado',
    accessorFn: (row) => {
      const debtorStatus = row.currentStatus;
      return debtorStatus && debtorStatus in statuses
        ? `${statuses[debtorStatus]?.name} ${statuses[debtorStatus]?.color}`
        : '';
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const ticketStatus = row.getValue('Estado') as string;
      const [name, ...colorArray] = ticketStatus.split(' ');
      const color = colorArray.join(' ');

      return (
        <div
          className={classNames(
            color || '',
            'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset inline-block text-center'
          )}
        >
          {name}
        </div>
      );
    },
  },
  {
    id: 'Nombre',
    accessorFn: (row) => `#${row.id} ${row.title}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue('Nombre') as string;
      const [id, ...titleParts] = name.split(' ');
      const title = titleParts.join(' ');

      return (
        <div className="capitalize">
          <span className="text-gray-500">{`${id} `}</span>
          <span className="text-black">{title}</span>
        </div>
      );
    },
  },
  {
    id: 'Descripción',
    accessorFn: (row) => `${row.description}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descripción
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('Descripción')}</div>
    ),
  },
  {
    id: 'Cliente',
    accessorFn: (row) => `${row.debtorName}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cliente
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('Cliente')}</div>
    ),
  },
  {
    id: 'Vencimiento',
    accessorFn: (row) => row.paymentDueAt,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Vencimiento
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const paymentDueDate = row.getValue('Vencimiento') as Date;
      const ticketStatus = row.getValue('Estado') as string;
      const dateDiff = Math.ceil(
        (paymentDueDate.getTime() - Date.now()) / (1000 * 3600 * 24)
      );
      const formattedDate = `${String(paymentDueDate.getDate()).padStart(
        2,
        '0'
      )}-${String(paymentDueDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${paymentDueDate.getFullYear()}`;

      const getContent = (textColor: string, daysText: string) => (
        <>
          <div className={`text-center font-medium ${textColor}`}>
            {daysText}
          </div>
          <div className={`text-center text-xs ${textColor}`}>
            Ven: {formattedDate}
          </div>
        </>
      );

      if (ticketStatus.includes('Pagado')) {
        return getContent('text-green-500', 'Pagado');
      }
      if (dateDiff < 0) {
        return getContent('text-red-500', `Hace ${Math.abs(dateDiff)} días`);
      }
      if (dateDiff === 0) {
        return getContent('text-yellow-500', 'Hoy día');
      }
      if (dateDiff <= 3) {
        return getContent('text-yellow-500', `En ${dateDiff} días`);
      }
      return getContent('text-green-500', `En ${Math.abs(dateDiff)} días`);
    },
  },
  {
    id: 'Valor',
    accessorFn: (row) => `${formatCurrency(row.amount)} ${row.currency}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Valor
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullAmount = row.getValue('Valor');

      if (typeof fullAmount === 'string') {
        return <div className="text-right font-medium">{fullAmount}</div>;
      }
      return null;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original;
      const { creditor } = ticket;
      const bankAccount =
        creditor?.bank_accounts && creditor.bank_accounts.length > 0
          ? creditor.bank_accounts[0]
          : undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <Link href={`/ticket/${ticket.id}`} className="block w-full">
                Ver ticket
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await createTicketState(
                  ticket.id,
                  'manually_paid',
                  accessToken
                );
                refetch();
              }}
              className="cursor-pointer"
            >
              Marcar como pagado
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await createTicketState(ticket.id, 'canceled', accessToken);
                refetch();
              }}
              className="cursor-pointer"
            >
              Anular ticket
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await deleteTicket(ticket.id, accessToken);
                refetch();
              }}
              className="cursor-pointer"
            >
              Eliminar ticket
            </DropdownMenuItem>
            {profile.admin && bankAccount && (
              <DropdownMenuItem
                onClick={() => {
                  const formattedBankBrand = getBankName(
                    bankAccount.bank_brand
                  );
                  const formattedAccountType =
                    bankAccount.account_type === 'cc'
                      ? 'Cuenta Corriente'
                      : bankAccount.account_type; // Ajustar según otros tipos de cuenta
                  const ticketInfo = `
                  ${creditor?.first_name} ${creditor?.last_name}
                  ${bankAccount.holder_identifier}
                  ${formattedBankBrand}
                  ${formattedAccountType}
                  ${bankAccount.account_number.replace(
                    /(\d{2})(\d{3})(\d{5})/,
                    '$1-$2-$3'
                  )}
                  ${bankAccount.mail}
                `;
                  copyToClipboard(ticketInfo);
                }}
                className="cursor-pointer"
              >
                Copiar cuenta banco
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
