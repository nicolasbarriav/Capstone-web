export default function formatCurrency(amount: number) {
  return `$${new Intl.NumberFormat('de-DE').format(amount)}`;
}
