// Orders are immutable. Every change must return a NEW order.
// Don't change these interfaces. Fix the functions below.

export interface OrderLine {
  readonly sku: string;
  readonly quantity: number;
}

export interface Order {
  readonly id: string;
  readonly lines: readonly OrderLine[];
  readonly note?: string;
}

export function addLine(order: Order, sku: string, quantity: number): Order {
  const existing = order.lines.find((line) => line.sku === sku);
  if (existing) {
    existing.quantity += quantity;
    return order;
  }
  order.lines.push({ sku, quantity });
  return order;
}

export function setNote(order: Order, note: string): Order {
  order.note = note;
  return order;
}

export function clearNote(order: Order): Order {
  return { ...order, note: undefined };
}

export function totalQuantity(order: Order): number {
  return order.lines.reduce((sum, line) => sum + line.quantity, 0);
}
