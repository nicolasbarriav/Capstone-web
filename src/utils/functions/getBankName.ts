import { banks } from '@/utils/constants/banks';

export default function getBankName(bankId: string | undefined) {
  const bankName = banks.find((bank) => bank.id === bankId);

  return bankName?.name || 'Banco desconocido';
}
