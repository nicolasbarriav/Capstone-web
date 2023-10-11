import { ChevronDownIcon } from '@radix-ui/react-icons';
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import adminMarkAsPayed from '@/utils/api/admin/adminMarkAsPayed';
import type { Ticket } from '@/utils/api/tickets/domain/ticket';
import type { ApiProfile } from '@/utils/api/users/queries/get-profile.query';

import { getColumns } from './columns';

interface Props {
  tickets: Ticket[];
  accessToken: string;
  refetch: () => void;
  profile: ApiProfile;
}

export default function TicketTable({
  tickets,
  accessToken,
  refetch,
  profile,
}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [amount, setAmount] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterColumn, setFilterColumn] = React.useState('Nombre');
  const data: Ticket[] = tickets;
  const columns = getColumns(accessToken, refetch, profile);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {errorMessage && (
        <div
          className="relative rounded border border-red-400 bg-red-200 px-2 py-1.5 text-sm text-red-700"
          role="alert"
        >
          <strong className="font-medium">Error!</strong>
          <span className="block sm:inline"> {errorMessage}</span>
          <span
            className="absolute inset-y-0 right-0 px-2 py-1"
            onClick={() => setErrorMessage(null)}
          >
            <svg
              className="h-5 w-5 fill-current text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"></path>
            </svg>
          </span>
        </div>
      )}
      {tickets && table ? (
        <>
          <div className="flex flex-col items-center space-y-4 py-4 sm:flex-row sm:space-y-0">
            <Input
              placeholder={`Filtrar por ${filterColumn.toLowerCase()}`}
              value={
                (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                '' // Usa filterColumn en lugar de 'email'
              }
              onChange={
                (event) =>
                  table
                    .getColumn(filterColumn)
                    ?.setFilterValue(event.target.value) // Usa filterColumn en lugar de 'email'
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 w-full sm:w-auto">
                  Filtrar por <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanFilter())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.id === filterColumn}
                      onCheckedChange={() => setFilterColumn(column.id)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {profile.admin && (
              <>
                <input
                  type="text"
                  id="price"
                  className="mx-5 block rounded-md border-0 py-2 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={amount}
                  onChange={(e) => {
                    // Check if the input is a number
                    if (/^\d*$/.test(e.target.value)) {
                      setAmount(e.target.value);
                    }
                  }}
                  name="amount"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={async () => {
                    const selectedRowIds = table
                      .getSelectedRowModel()
                      .rows.map((row) => {
                        return {
                          id: row.original.id as number,
                          client_id: row.original.creditor?.id || '',
                        };
                      });
                    const transferData = {
                      amount: parseInt(amount, 10),
                      currency: 'CLP',
                      ticket_ids: selectedRowIds,
                    };
                    try {
                      await adminMarkAsPayed(transferData, accessToken);
                      refetch();
                    } catch (err) {
                      if (err instanceof Error) {
                        setErrorMessage(err.message);
                      } else {
                        setErrorMessage('An unexpected error occurred.');
                      }
                    }
                  }}
                >
                  Pagado Vambe
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columnas <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel()?.rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>{' '}
        </>
      ) : null}
    </div>
  );
}
