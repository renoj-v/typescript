// Receipt printer. See README.md for the full spec.

// TODO: export interface LineItem { ... }
// TODO: export interface Order { ... }

export const RECEIPT_WIDTH = 32;

export function lineTotal(item) {
  throw new Error("TODO: lineTotal");
}

export function subtotal(order) {
  throw new Error("TODO: subtotal");
}

export function tax(order) {
  throw new Error("TODO: tax");
}

export function formatMoney(amount) {
  throw new Error("TODO: formatMoney");
}

export function row(label, value) {
  throw new Error("TODO: row");
}

export function printReceipt(order) {
  throw new Error("TODO: printReceipt");
}

// --- Demo: runs only via `npm run exercise 01 project` ---
const sampleOrder = {
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
