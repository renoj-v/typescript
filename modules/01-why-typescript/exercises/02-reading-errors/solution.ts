// Price-formatting helpers: solved.

/** Formats an amount with a currency symbol and 2 decimals, e.g. "$4.50". */
export function formatPrice(amount: number, currency: string): string {
  return `${currency}${amount.toFixed(2)}`;
}

// 1. TS7006: under `strict`, parameters need a type. TypeScript can't infer
//    parameter types from how a function body *uses* them.
export function formatTotal(prices: number[]): string {
  let total = 0;
  for (const price of prices) total += price;
  return formatPrice(total, "$");
}

// 2. TS18048: `discount?: number` means `number | undefined`. `100 * undefined`
//    is NaN at runtime. A default value removes `undefined` from the type
//    inside the function, so callers can still omit it.
export function applyDiscount(amount: number, discount = 0): number {
  return amount - amount * discount;
}

// 3. TS2339: `toFixed` exists on numbers, not strings. The real bug was the
//    parameter type: a price should be a number. Fix the cause, not the symptom.
export function formatPriceTag(label: string, price: number): string {
  return `${label}: $${price.toFixed(2)}`;
}

// 4. TS2345: "4.99" is a string. Store money as a number and format it only
//    when displaying it.
export const shippingCost = 4.99;
export const shippingLabel = formatPrice(shippingCost, "$");

// 5. TS2554: `formatPrice` requires both arguments. JS would have printed
//    "undefined3.00".
export function formatEuro(amount: number): string {
  return formatPrice(amount, "€");
}
