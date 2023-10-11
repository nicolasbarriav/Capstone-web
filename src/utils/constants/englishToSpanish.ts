export default function englishToSpanish(string: string) {
  if (string === 'daily') return 'Diario';
  if (string === 'weekly') return 'Semanal';
  if (string === 'monthly') return 'Mensual';
  if (string === 'annually') return 'Anual';
  if (string === 'quarterly') return 'Trimestral';
  if (string === 'biannually') return 'Semestral';
  if (string === 'active') return 'Activa';
  if (string === 'canceled') return 'Cancelado';
  return string;
}
