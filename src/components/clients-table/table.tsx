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
  // DropdownMenuSeparator,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-two-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
//import adminMarkAsPayed from '@/utils/api/admin/adminMarkAsPayed';
// import type { Ticket } from '@/utils/api/tickets/domain/ticket';
import type { ApiProfile } from '@/utils/api/users/queries/get-profile.query';
import type { DebtorStats } from '@/utils/api/debtors/getDebtorsStats';

import { getColumns } from './columns';
import { Ticket } from '@/utils/api/tickets/domain/ticket';

interface Props {
  debtors: DebtorStats[];
  tickets: Ticket[];
  accessToken: string;
  refetch: () => void;
  profile: ApiProfile;
}

export default function TicketTable({
  debtors,
  tickets,
  accessToken,
  refetch,
  profile,
}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // const [amount, setAmount] = React.useState(''); no se utiliza (?)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterColumn, setFilterColumn] = React.useState('Nombre');
  // START  FILTRO
  const [findCompany, setFindCompany] = React.useState({isCompany : true});
  // const [findPerson, setFindPerson] = React.useState({isPerson : false});
  const [newDebtor, setNewDebtor] = React.useState({isNew : false, isDays : 3});
  const [isReliable, setNewReliable] = React.useState({reliable : false});
  // END  FILTRO
  const data: DebtorStats[] = debtors;
  const columns = getColumns(accessToken, refetch, profile, tickets);

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
      {debtors && table ? (
        <>
          <div className="flex flex-col items-center space-y-4 py-4 sm:flex-row sm:space-y-0">
            {/* BUSCADOR POR NOMBRE */}
            <Input
              placeholder={`Buscar por nombre`}
              value={
                (table.getColumn("Nombre")?.getFilterValue() as string) ??
                ''
              }
              onChange={
                (event) =>
                  table
                    .getColumn("Nombre")
                    ?.setFilterValue(event.target.value) 
              }
              className="max-w-sm"
            />

            {/* START FILTRO DOS COLUMNAS */}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Filtrar por
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              
              {/* isCompany */}
              <DropdownMenuContent align="end">            
                <DropdownMenuCheckboxItem
                  checked={findCompany.isCompany}
                  onClick={()=>
                    table
                    .getColumn("is_company")
                    ?.setFilterValue((!findCompany.isCompany).toString())
                    
                  }
                  onCheckedChange={() =>
                      // .filter((is_company) => is_company === findCompany.isCompany)
                    setFindCompany((prevOptions) => ({
                      ...prevOptions,
                      isCompany: !prevOptions.isCompany,
                    }))
                    
                  }
                >
                  {"Empresa"}
                </DropdownMenuCheckboxItem>

                {/* isPerson */}
                {/* <DropdownMenuCheckboxItem
                  checked={findPerson.isPerson}
                  onCheckedChange={() =>
                    // .filter((is_company) => is_company === findCompany.isCompany)
                  setFindPerson((prevOptions) => ({
                    ...prevOptions,
                    isPerson: !prevOptions.isPerson,
                  }))
                  
                }
                  onClick={()=>
                    (findPerson.isPerson && findCompany.isCompany)?
                    table
                    .getAllColumns()
                    :
                    (findPerson.isPerson && findCompany.isCompany != true)?
                    table
                    .getColumn("is_company")
                    ?.setFilterValue((!findPerson.isPerson).toString())
                    :
                    (findPerson.isPerson != true && findCompany.isCompany == true)?
                    table
                    .getColumn("is_company")
                    ?.setFilterValue((findCompany.isCompany).toString())
                    :
                    null
                    }
                  >
                    {"Persona"}
                </DropdownMenuCheckboxItem> */}

                {/* isNew */}
                <DropdownMenuCheckboxItem
                    checked={newDebtor.isNew} 
                    onClick={()=>
                      table
                      .getColumn("last_ticket_date")
                      ?.setFilterValue((newDebtor.isNew).toString())                      
                    }
                    onCheckedChange={() =>
                        setNewDebtor((prevOptions) => ({
                        ...prevOptions,
                        isNew: !prevOptions.isNew,
                      }))
                      
                    }
                  >
                    {"Reciente"}
                  </DropdownMenuCheckboxItem>
                  
                  {/* isReliable */}
                  <DropdownMenuCheckboxItem
                    checked={isReliable.reliable} 
                    onClick={()=>
                      table
                      .getColumn("is_reliable")
                      ?.setFilterValue((isReliable.reliable).toString())                      
                    }
                    onCheckedChange={() =>
                        setNewReliable((prevOptions) => ({
                        ...prevOptions,
                        reliable: !prevOptions.reliable,
                      }))
                      
                    }
                  >
                    {"Confiable"}
                  </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>


            {/* END FILTRO DOS COLUMNAS */}

          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (             
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        (header.id != "is_company" && header.id != "last_ticket_date" && header.id != "is_reliable")? 
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                        :
                        // FILTRO debo hacer esta informacion invisible hidden
                        <TableHead key={header.id} hidden >
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
                        (cell.column.id != "is_company" && cell.column.id != "last_ticket_date" && cell.column.id != "is_reliable")? 
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                        :
                        // FILTRO debo hacer esta informacion invisible  hidden
                        <TableCell key={cell.id} hidden>
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
