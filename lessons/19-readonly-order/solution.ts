export interface OrderLine {
  readonly sku: string;
  readonly quantity: number;
}

export interface Order {
  readonly id: string;
  // `readonly OrderLine[]`: no push/pop/splice, and no index assignment.
  readonly lines: readonly OrderLine[];
  readonly note?: string;
}

export function addLine(order: Order, sku: string, quantity: number): Order {
  const exists = order.lines.some((line) => line.sku === sku);
  // Non-mutating array methods (map, filter, spread) work fine on readonly arrays.
  const lines = exists
    ? order.lines.map((line) => (line.sku === sku ? { ...line, quantity: line.quantity + quantity } : line))
    : [...order.lines, { sku, quantity }];
  return { ...order, lines };
}

export function setNote(order: Order, note: string): Order {
  return { ...order, note };
}

// With `exactOptionalPropertyTypes`, `note?: string` means "string, or no
// key at all". `note: undefined` is a third state the type doesn't allow.
// Rest destructuring removes the key for real.
export function clearNote(order: Order): Order {
  const { note: _note, ...rest } = order;
  return rest;
}

export function totalQuantity(order: Order): number {
  return order.lines.reduce((sum, line) => sum + line.quantity, 0);
}
