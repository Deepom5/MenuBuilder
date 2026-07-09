const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
};

export function currencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code.toUpperCase()] ?? code;
}

export function formatPrice(value: number, currency: string): string {
  const symbol = currencySymbol(currency);
  const rounded = Number.isFinite(value) ? value : 0;
  return `${symbol}${rounded.toFixed(2)}`;
}
