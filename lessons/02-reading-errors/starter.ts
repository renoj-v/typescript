// Price-formatting helpers for an online shop.
// Each section has ONE type error. Read the message, then fix it.

/** Formats an amount with a currency symbol and 2 decimals, e.g. "$4.50". Don't change this. */
export function formatPrice(amount: number, currency: string): string {
  return `${currency}${amount.toFixed(2)}`;
}

// 1. Sum a list of prices and format the total in dollars.
export function formatTotal(prices: number[]) {
  let total = 0;
  for (const price of prices) total += price;
  return formatPrice(total, "$");
}

// 2. Apply an optional discount (0.2 = 20% off). No discount means full price.
export function applyDiscount(amount: number, discount = 0): number {
  return amount - amount * discount;
}

// 3. Build a price tag like "Mug: $12.00".
export function formatPriceTag(label: string, price: number): string {
  return `${label}: $${price.toFixed(2)}`;
}

// 4. Flat-rate shipping, shown as "$4.99".
export const shippingCost = 4.99;
export const shippingLabel = formatPrice(shippingCost, "$");

// 5. Format an amount in euros, e.g. "€3.00".
export function formatEuro(amount: number): string {
  return formatPrice(amount, "€");
}
