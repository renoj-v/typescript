// Untyped cart helpers. Add types, then fix the bug they reveal.

// TODO: export interface CartItem { ... }

export function lineTotal(item) {
  return item.price * item.quantity;
}

export function cartSubtotal(items) {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function cartTotal(items, discountPercent, taxRate = 0.1) {
  const subtotal = cartSubtotal(items);
  const discounted = discountPercent ? subtotal * (1 - discountPercent / 100) : subtotal;
  return Math.round(discounted * (1 + taxRate) * 100) / 100;
}

export function describeCart(items, currency = "$") {
  if (items.length === 0) return "Your cart is empty";
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const label = count === 1 ? "item" : "items";
  return `${count} ${label}, total ${currency}${cartTotal(items, currency).toFixed(2)}`;
}
