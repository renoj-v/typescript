import { readFileSync } from "node:fs";
import { describe, expect, expectTypeOf, test } from "vitest";
import {
  countByGenre,
  discountedPrice,
  prices,
  shippingFor,
  totalsByGenre,
  totalValue,
} from "./starter";

const source = readFileSync(new URL("./starter.ts", import.meta.url), "utf8");

describe("Step 1: redundant annotations removed", () => {
  test("source no longer contains them", () => {
    expect(source).not.toMatch(/prices:\s*number\[\]/);
    expect(source).not.toMatch(/\(book:\s*Book\)/);
    expect(source).not.toMatch(/totalValue:\s*number/);
    expect(source).not.toMatch(/sum:\s*number/);
    expect(source).not.toMatch(/let count:\s*number/);
  });

  test("the books annotation is kept", () => {
    expect(source).toMatch(/books:\s*Book\[\]/);
  });

  test("inferred types are unchanged", () => {
    expectTypeOf(prices).toEqualTypeOf<number[]>();
    expectTypeOf(totalValue).toEqualTypeOf<number>();
    expect(countByGenre("sci-fi")).toBe(2);
  });
});

describe("Step 2: needed annotations added", () => {
  test("discountedPrice", () => {
    expectTypeOf(discountedPrice).toEqualTypeOf<(price: number, percent: number) => number>();
    expect(discountedPrice(20, 25)).toBe(15);
  });

  test("totalsByGenre", () => {
    expectTypeOf(totalsByGenre).returns.toEqualTypeOf<Record<string, number>>();
    const totals = totalsByGenre();
    expect(totals["sci-fi"]).toBeCloseTo(24.98);
    expect(totals.fantasy).toBeCloseTo(8.5);
  });

  test("shippingFor always returns a number", () => {
    expectTypeOf(shippingFor).returns.toEqualTypeOf<number>();
    expect(shippingFor(50)).toBe(0);
    expect(shippingFor(20)).toBe(4.99);
  });
});
