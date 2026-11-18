/**
 * Design system: one way to write money across the site.
 * Product prices always show cents (S$49.90, S$45.00); promotional
 * amounts use whole dollars (S$10 off).
 */
export function formatPrice(amount: number): string {
  return `S$${amount.toFixed(2)}`;
}

export function formatAmount(amount: number): string {
  return Number.isInteger(amount) ? `S$${amount}` : formatPrice(amount);
}
