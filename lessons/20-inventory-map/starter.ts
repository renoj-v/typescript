// TODO: define the types. See README.md.
export type Inventory = unknown;
export type StockLevel = unknown;
export type StockReport = unknown;

export function quantityOf(inventory, sku) {
  throw new Error("TODO: quantityOf");
}

export function restock(inventory, sku, amount) {
  throw new Error("TODO: restock");
}

export function merge(...inventories) {
  throw new Error("TODO: merge");
}

export function stockReport(inventory, lowThreshold) {
  throw new Error("TODO: stockReport");
}
