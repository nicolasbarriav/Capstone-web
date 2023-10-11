export default function formatNumber(num: string) {
  // Reverse the string for easy processing

  // Check if the number has a decimal part
  const [whole, decimal] = num.split(',');
  console.log({ decimal });

  const wholePart = String(whole?.replace(/\./g, ''));

  let formatedWholePart = '';

  // Add the dots
  for (let i = 0; i < wholePart.length; i += 1) {
    if (i % 3 === 0 && i !== 0) {
      formatedWholePart = `${
        wholePart[wholePart.length - i - 1]
      }.${formatedWholePart}`;
    } else {
      formatedWholePart = `${
        wholePart[wholePart.length - i - 1]
      }${formatedWholePart}`;
    }
  }

  return `${formatedWholePart}${
    decimal !== undefined && whole ? `,${decimal}` : ''
  }`;
}

export function removeDots(num: string) {
  return num.replace(/\./g, '').replace(',', '.');
}
