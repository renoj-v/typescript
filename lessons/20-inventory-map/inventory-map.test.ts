import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type Inventory,
  type StockLevel,
  type StockReport,
  merge,
  quantityOf,
  restock,
  stockReport,
} from "./starter";

const stock: Inventory = { "MUG-1": 12, "TEE-M": 0, "CAP-1": 3, "BAG-2": 2 };

describe("types", () => {
  test("shapes", () => {
    expectTypeOf<Inventory>().toEqualTypeOf<Record<string, number>>();
    expectTypeOf<StockLevel>().toEqualTypeOf<"out" | "low" | "ok">();
    expectTypeOf<StockReport>().toEqualTypeOf<{ out: string[]; low: string[]; ok: string[] }>();
  });

  test("a report needs every level", () => {
    // @ts-expect-error - "ok" is missing
    const partial: StockReport = { out: [], low: [] };
    expect(partial).toBeDefined();
  });

  test("signatures", () => {
    expectTypeOf(quantityOf).toEqualTypeOf<(inventory: Inventory, sku: string) => number>();
    expectTypeOf(restock).returns.toEqualTypeOf<Inventory>();
    expectTypeOf(merge).toEqualTypeOf<(...inventories: Inventory[]) => Inventory>();
    expectTypeOf(stockReport).toEqualTypeOf<(inventory: Inventory, lowThreshold: number) => StockReport>();
  });
});

describe("quantityOf", () => {
  test("known and unknown SKUs", () => {
    expect(quantityOf(stock, "MUG-1")).toBe(12);
    expect(quantityOf(stock, "NOPE")).toBe(0);
  });
});

describe("restock", () => {
  test("adds to existing and new SKUs without mutating", () => {
    const next = restock(restock(stock, "TEE-M", 5), "NEW-1", 2);
    expect(next["TEE-M"]).toBe(5);
    expect(next["NEW-1"]).toBe(2);
    expect(stock["TEE-M"]).toBe(0);
    expect("NEW-1" in stock).toBe(false);
  });
});

describe("merge", () => {
  test("sums any number of inventories", () => {
    expect(merge({ a: 1, b: 2 }, { b: 3, c: 4 }, { a: 10 })).toEqual({ a: 11, b: 5, c: 4 });
    expect(merge()).toEqual({});
  });
});

describe("stockReport", () => {
  test("sorts SKUs into levels", () => {
    expect(stockReport(stock, 3)).toEqual({
      out: ["TEE-M"],
      low: ["BAG-2", "CAP-1"],
      ok: ["MUG-1"],
    });
  });
});
