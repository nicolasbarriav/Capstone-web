export const statuses: {
  [key: string]: {
    name: string;
    color: string;
  };
} = {
  paid: {
    name: 'Pagado',
    color: 'text-green-600 bg-green-50 ring-green-600/20',
  },
  settled: {
    name: 'Liquidado',
    color: 'text-green-600 bg-green-50 ring-green-600/20',
  },
  manually_paid: {
    name: 'Pagado manualmente',
    color: 'text-green-600 bg-green-50 ring-green-600/20',
  },
  generated: {
    name: 'Generado',
    color: 'text-yellow-600 bg-yellow-50 ring-yellow-600/20',
  },
  available: {
    name: 'Disponible para pago',
    color: 'text-yellow-600 bg-yellow-50 ring-yellow-600/20',
  },
  expired: {
    name: 'Vencido',
    color: 'text-red-600 bg-red-50 ring-red-600/10',
  },
  canceled: {
    name: 'Anulado',
    color: 'text-yellow-600 bg-yellow-50 ring-yellow-600/20',
  },
};
