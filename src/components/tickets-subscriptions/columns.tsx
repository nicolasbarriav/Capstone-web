import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { statuses } from '@/utils/constants/statuses';
import classNames from '@/utils/functions/classNames';
import formatCurrency from '@/utils/functions/formatCurrency';

import type { Subscription } from '@/utils/api/subscriptions/domain/subscription';
import englishToSpanish from '@/utils/constants/englishToSpanish';
import { Button } from '../ui/button';

export const getColumns = (): ColumnDef<Subscription>[] => [
  {
    id: 'Estado',
    accessorFn: (row) => {
      const subscriptionStatus = row.status;
      return subscriptionStatus && subscriptionStatus === 'active'
        ? `Activo ${statuses.paid?.color}`
        : `Inactivo ${statuses.expired?.color}`;
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
    id: 'Título',
    accessorFn: (row) => `#${row.id} ${row.title}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Título
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue('Título') as string;
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
    id: 'Información',
    accessorFn: (row) => {
      return {
        startDate: row.startDate,
        frequency: row.frecuency,
        totalCycles: row.totalCycles,
        remainingCycles: row.remainingCycles,
      };
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Información
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { startDate, frequency, totalCycles, remainingCycles } =
        row.getValue('Información') as {
          startDate: Date;
          frequency: string;
          totalCycles: number;
          remainingCycles: number;
        };
      const formattedDate = `${String(startDate.getDate()).padStart(
        2,
        '0'
      )}-${String(startDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${startDate.getFullYear()}`;

      return (
        <>
          <div className={`text-center font-medium`}>
            {englishToSpanish(frequency)}
          </div>
          <div className={`text-center text-xs text-gray-500`}>{`${
            totalCycles - remainingCycles
          }/${totalCycles} cuotas emitidas`}</div>
          <div className={`text-center text-xs text-gray-400`}>
            Inicio: {formattedDate}
          </div>
        </>
      );
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
              <Link
                href={`/subscriptions/${ticket.id}`}
                className="block w-full"
              >
                Ver suscripción
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
