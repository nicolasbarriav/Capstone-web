function calculateRutDigit(rut: string): string {
  // Limpiar el RUT y convertirlo a un array de dígitos
  const digits = rut.replace(/\D/g, '').split('').reverse().map(Number);

  // Serie numérica
  const serie = [2, 3, 4, 5, 6, 7];

  // Calcular la suma de los productos
  const sum = digits.reduce(
    // @ts-ignore
    (acc, val, idx) => acc + val * serie[idx % serie.length],
    0
  );

  // Calcular el resto de la división por 11
  const remainder = sum % 11;

  // Calcular el dígito verificador
  let digit = (11 - remainder).toString();

  // Convertir el resultado a la representación correcta
  if (digit === '11') {
    digit = '0';
  } else if (digit === '10') {
    digit = 'K';
  }

  return digit;
}

export function verifyRutDigit(rutWithDigit: string): boolean {
  const rut = rutWithDigit.slice(0, -1);
  const providedDigit = rutWithDigit.slice(-1).toUpperCase();

  // Calculamos el dígito verificador esperado
  const expectedDigit = calculateRutDigit(rut);

  // Si el dígito proporcionado no coincide con el esperado, lanzamos un error
  if (providedDigit !== expectedDigit) {
    return false;
  }
  return true;
}

export default async function getNameByRUT(
  rutWithDigit: string
): Promise<string | null> {
  // Extraemos el RUT y el dígito verificador
  const rut = rutWithDigit.slice(0, -1);
  const providedDigit = rutWithDigit.slice(-1).toUpperCase();

  // Calculamos el dígito verificador esperado
  const expectedDigit = calculateRutDigit(rut);

  // Si el dígito proporcionado no coincide con el esperado, lanzamos un error
  if (providedDigit !== expectedDigit) {
    return null;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/utils/rut/${rutWithDigit}` ||
      'http://localhost:3000'
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const data = await response.json();
    return data.name || null;
  }
}
