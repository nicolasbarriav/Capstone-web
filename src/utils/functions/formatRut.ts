export default function formatRut(input: string): string {
  const cleanedInput = input.replace(/[^0-9Kk]/g, '').toUpperCase();
  const { length } = cleanedInput;

  if (length < 2) {
    return cleanedInput;
  }

  const numberPart = cleanedInput.slice(0, length - 1);
  const verificationDigit = cleanedInput.slice(length - 1);
  const formattedNumberPart = numberPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formattedNumberPart}-${verificationDigit}`;
}
