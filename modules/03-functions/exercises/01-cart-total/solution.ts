// Typed cart helpers.

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export function lineTotal(item: CartItem): number {
  return item.price * item.quantity;
}

export function cartSubtotal(items: CartItem[]): number {
  // The callback's `sum` and `item` are contextually typed. No annotations needed.
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

// `discountPercent?` → `number | undefined` inside the function.
// `taxRate = 0.1` → `number` inside, and optional for callers.
export function cartTotal(items: CartItem[], discountPercent?: number, taxRate = 0.1): number {
  const subtotal = cartSubtotal(items);
  const discounted =
    discountPercent === undefined ? subtotal : subtotal * (1 - discountPercent / 100);
  return Math.round(discounted * (1 + taxRate) * 100) / 100;
}

export function describeCart(items: CartItem[], currency = "$"): string {
  if (items.length === 0) return "Your cart is empty";
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const label = count === 1 ? "item" : "items";
  // The bug: `cartTotal(items, currency)` passed the currency string as the
  // discount. "€" / 100 is NaN in JS. Once `discountPercent` was typed as
  // `number`, TS2345 pointed straight at it.
  return `${count} ${label}, total ${currency}${cartTotal(items).toFixed(2)}`;
}
