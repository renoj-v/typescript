// Index signature: any string key, number values. `Record<string, number>`
// is exactly the same type, so use whichever reads better.
export type Inventory = { [sku: string]: number };

export type StockLevel = "out" | "low" | "ok";

// `Record` with a *union* of keys requires every key to be present,
// which is perfect for a fixed set of buckets.
export type StockReport = Record<StockLevel, string[]>;

export function quantityOf(inventory: Inventory, sku: string): number {
  // `inventory[sku]` is `number | undefined` because the key might not
  // exist. noUncheckedIndexedAccess makes that honest.
  return inventory[sku] ?? 0;
}

export function restock(inventory: Inventory, sku: string, amount: number): Inventory {
  // A computed key in a spread copy: a new object, with the original untouched.
  return { ...inventory, [sku]: quantityOf(inventory, sku) + amount };
}

export function merge(...inventories: Inventory[]): Inventory {
  const total: Inventory = {};
  for (const inventory of inventories) {
    for (const [sku, quantity] of Object.entries(inventory)) {
      total[sku] = quantityOf(total, sku) + quantity;
    }
  }
  return total;
}

export function stockReport(inventory: Inventory, lowThreshold: number): StockReport {
  // Every key is required here. Leaving out `ok` would be a compile error.
  const report: StockReport = { out: [], low: [], ok: [] };
  for (const [sku, quantity] of Object.entries(inventory)) {
    const level: StockLevel = quantity === 0 ? "out" : quantity <= lowThreshold ? "low" : "ok";
    report[level].push(sku); // `report[level]` is always defined, because the keys are a known union
  }
  for (const skus of Object.values(report)) skus.sort();
  return report;
}
