export default function formatNumber(num: number): string {
  const [integerPart, decimalPart] = num.toString().split('.');
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedDecimalPart = decimalPart ? decimalPart.replace(/0+$/, '') : '';
  return formattedDecimalPart ? `${formattedIntegerPart}.${formattedDecimalPart}` : formattedIntegerPart;
}