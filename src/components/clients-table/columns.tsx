import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { MouseEventHandler, useState } from "react";
import { Bar } from "react-chartjs-2";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import CustomPopup from "./popup";
// import Link from 'next/link';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import createTicketState from '@/utils/api/tickets/createTicketState';
// import deleteTicket from '@/utils/api/tickets/deleteTicket';

import getGroupTickets from "@/utils/api/tickets/getGroupTickets";

import type { Ticket } from "@/utils/api/tickets/domain/ticket";
import type { DebtorStats } from "@/utils/api/debtors/getDebtorsStats";

import type { ApiProfile } from "@/utils/api/users/queries/get-profile.query";

import classNames from "@/utils/functions/classNames";
// import formatCurrency from '@/utils/functions/formatCurrency';
// import getBankName from '@/utils/functions/getBankName';

import { Button } from "../ui/button";
import { useQuery } from "react-query";
import { any } from "zod";
import TicketTable from "../tickets-table/table";

// const copyToClipboard = (text: string) => {
//   if (navigator.clipboard) {
//     navigator.clipboard.writeText(text);
//   }
// };

export const getColumns = (
  accessToken: string,
  refetch: () => void,
  profile: ApiProfile,
  tickets: Ticket[]
): ColumnDef<DebtorStats>[] => [
  {
    id: "Riesgo",
    accessorFn: (row) => {
      const debtorRisk = row.risk;
      // return debtorRisk ? `${debtorRisk} ${coloresRisk[debtorRisk]?.color}` // Si implementamos colores pa los risks
      //   : '';
      function getRandomInt(maximo: number) {
        return Math.floor(Math.random() * maximo + 1);
      }
      return debtorRisk ? `${debtorRisk}` : `${getRandomInt(100)}`;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Riesgo
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const risk = row.getValue("Riesgo") as number;
      let backgroundColorClass = "";

      // Determina el color de fondo basado en el rango de risk
      if (risk >= 0 && risk <= 10) {
        backgroundColorClass = "bg-[#8EE0C3]";
      } else if (risk >= 11 && risk <= 20) {
        backgroundColorClass = "bg-[#A5F0C9]";
      } else if (risk >= 21 && risk <= 30) {
        backgroundColorClass = "bg-[#C9F9C3]";
      } else if (risk >= 31 && risk <= 40) {
        backgroundColorClass = "bg-[#DFF8B8]";
      } else if (risk >= 41 && risk <= 50) {
        backgroundColorClass = "bg-[#FDF4B4]";
      } else if (risk >= 51 && risk <= 60) {
        backgroundColorClass = "bg-[#FEE9B8]";
      } else if (risk >= 61 && risk <= 70) {
        backgroundColorClass = "bg-[#FFD3AD]";
      } else if (risk >= 71 && risk <= 80) {
        backgroundColorClass = "bg-[#FFC5AE]";
      } else if (risk >= 81 && risk <= 90) {
        backgroundColorClass = "bg-[#FFA5B0]";
      } else if (risk >= 91 && risk <= 100) {
        backgroundColorClass = "bg-[#F8A1B8]";
      } else {
        backgroundColorClass = "bg-gray-200"; // Color predeterminado si no está en ningún rango
      }
      // const [name, ...colorArray] = debtorRisk.split(' ');
      // const color = colorArray.join(' ');

      return (
        <div
          className={classNames(
            "rounded-full py-1 px-2 text-xs font-medium border-transparent inline-block text-right",
            backgroundColorClass
          )}
        >
          {risk}%
        </div>
      );
    },
  },
  {
    id: "Nombre",
    accessorFn: (row) => `#${row.id} ${row.name}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("Nombre") as string;
      const [id, ...titleParts] = name.split(" ");
      const title = titleParts.join(" ");

      return (
        <div className="capitalize">
          <span className="text-gray-500">{`${id} `}</span>
          <span className="text-black">{title}</span>
        </div>
      );
    },
  },
  {
    id: "Total",
    accessorFn: (row) =>
      row.currency ? `${row.total} ${row.currency}` : `${row.total}`, // transformar a int (?)
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Total")}</div>
    ),
  },
  {
    id: "Pagado",
    accessorFn: (row) =>
      row.currency ? `${row.paid} ${row.currency}` : `${row.paid}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pagado
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Pagado")}</div>
    ),
  },
  {
    id: "Por Vencer",
    accessorFn: (row) =>
      row.currency
        ? `${row.to_due} ${row.currency}` // ${formatCurrency(row.amount)}
        : `${row.to_due}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Por Vencer
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Por Vencer")}</div>
    ),
  },
  {

    id: "Vencido",
    accessorFn: (row) =>
      row.currency ? `${row.expired} ${row.currency}` : `${row.expired}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vencido
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.getValue("Vencido")}</div>
      );
    },
  },
  {
    id: "Detalle",
    enableHiding: false,

    cell: ({ row }) => {
      const debtor = row.original;
      let debtorId = debtor.id;
      
      const details = tickets.filter((ticket) => ticket.debtorId == debtorId);

      console.log("tickets", tickets);
      const [isPopupOpen, setIsPopupOpen] = useState(false);
      

      return <CustomPopup details={details} debtor={debtor} isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />;
    },
  },

  // ### AGREGAR FILTRO: COLUMNAS INVISIBLES: IS_NEW & IS_COMPANY & IS_RELIABLE###
  //IS_COMPANY
  {
    id: 'is_company',
    // accessorFn: (row) => row.is_company? `${row.is_company}`: "false",
    accessorFn: (row) => (Math.random() < 0.5).toString(),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Company
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const is_company = row.getValue('is_company') as string;

      return (
        <div
          className={classNames(
            'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset inline-block text-center'
          )}
        >
          {is_company}
        </div>
      );
    },
  },

  //IS_NEW:  last_ticket_date veremos si es cliente reciente atraves de su ultimo ticket
  {
    id: 'last_ticket_date',
    // accessorFn: (row) => row.last_ticket_date? `${row.last_ticket_date as string}`: null,
    accessorFn: (row) => {
      const date = new Date();// dia actual

      const is_new = (row.last_ticket_date) as String;//YY-MM-DD
      const num = is_new.split("-");
      const new_date = `${num[1]}/${num[2]}/${num[0]}`;
      const date2 = new Date(new_date);// dia del ticket
      
      const diffTime = Math.abs(date2 - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return (diffDays < 3)? "true":"false";
    } ,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          New
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const is_new = row.getValue('last_ticket_date') as string;
      // IMPLEMETO 1
      // const date = new Date();// dia actual

      // const is_new = (row.getValue('last_ticket_date')) as String;//YY-MM-DD
      // const num = is_new.split("-");
      // const new_date = `${num[1]}/${num[2]}/${num[0]}`;
      // const date2 = new Date(new_date);// dia del ticket
      
      // const diffTime = Math.abs(date2 - date);
      // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      // FIN IMPLEMETO 1

      // ASI LO HICIERON ELLOS
      // const paymentDueDate = row.getValue('Vencimiento') as Date;
      // const ticketStatus = row.getValue('Estado') as string;
      // const dateDiff = Math.ceil(
      //   (paymentDueDate.getTime() - Date.now()) / (1000 * 3600 * 24)
      // );
      // const formattedDate = `${String(paymentDueDate.getDate()).padStart(
      //   2,
      //   '0'
      // )}-${String(paymentDueDate.getMonth() + 1).padStart(
      //   2,
      //   '0'
      // )}-${paymentDueDate.getFullYear()}`;

      return (
        <div
          className={classNames(
            'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset inline-block text-center'
          )}
        >
          {is_new} 
        </div>
      );
    },
  },

  // IS_RELIABLE: 
  {
    id: 'is_reliable',
    // accessorFn: (row) => row.risk?((row.risk > 50)?"true":"false"): null,
    accessorFn: (row) => (Math.random() < 0.5).toString(),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Reliable
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const is_reliable = row.getValue('is_reliable') as string;

      return (
        <div
          className={classNames(
            'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset inline-block text-center'
          )}
        >
          {is_reliable}
        </div>
      );
    },
  },
  //FIN PROBAR AGREGAR FILTRO
];
