// Receipt printer: reference solution.

export interface LineItem {
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  items: LineItem[];
  /** 0.08 means 8% */
  taxRate: number;
}

export const RECEIPT_WIDTH = 32;

export function lineTotal(item: LineItem): number {
  return item.unitPrice * item.quantity;
}

export function subtotal(order: Order): number {
  // `reduce` with a numeric starting value: TypeScript infers `sum: number`.
  return order.items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function tax(order: Order): number {
  // Round to cents so the printed tax and the total agree.
  return Math.round(subtotal(order) * order.taxRate * 100) / 100;
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function row(label: string, value: string): string {
  // padStart counts the label too, so the full line is RECEIPT_WIDTH chars.
  return label + value.padStart(RECEIPT_WIDTH - label.length);
}

export function printReceipt(order: Order): string {
  const divider = "-".repeat(RECEIPT_WIDTH);
  const itemRows = order.items.map((item) =>
    row(`${item.quantity} x ${item.name}`, formatMoney(lineTotal(item))),
  );
  const sub = subtotal(order);
  const taxAmount = tax(order);
  // `Math.round` avoids "Tax (7.000000000000001%)" from 0.07 * 100.
  const ratePercent = Math.round(order.taxRate * 100);

  return [
    `Receipt #${order.id}`,
    `Customer: ${order.customer}`,
    divider,
    ...itemRows,
    divider,
    row("Subtotal", formatMoney(sub)),
    row(`Tax (${ratePercent}%)`, formatMoney(taxAmount)),
    row("Total", formatMoney(sub + taxAmount)),
  ].join("\n");
}

// --- Demo: runs only via `npm run lesson 5` ---
// Annotating with `Order` checks the sample data against the interface.
const sampleOrder: Order = {
  id: "A-1001",
  customer: "Ada",
  taxRate: 0.08,
  items: [
    { name: "Coffee beans", unitPrice: 14.5, quantity: 2 },
    { name: "Filter papers", unitPrice: 3.99, quantity: 1 },
  ],
};

if (import.meta.main) {
  console.log(printReceipt(sampleOrder));
}
