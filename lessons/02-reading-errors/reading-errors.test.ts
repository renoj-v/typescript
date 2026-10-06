import { describe, expect, expectTypeOf, test } from "vitest";
import {
  applyDiscount,
  formatEuro,
  formatPriceTag,
  formatTotal,
  shippingCost,
  shippingLabel,
} from "./starter";

describe("1. formatTotal", () => {
  test("sums and formats", () => {
    expect(formatTotal([1.5, 2.25])).toBe("$3.75");
    expect(formatTotal([])).toBe("$0.00");
  });
  test("accepts an array of numbers", () => {
    expectTypeOf(formatTotal).parameter(0).toEqualTypeOf<number[]>();
    expectTypeOf(formatTotal).returns.toEqualTypeOf<string>();
  });
});

describe("2. applyDiscount", () => {
  test("no discount = full price", () => {
    expect(applyDiscount(100)).toBe(100);
  });
  test("applies a discount", () => {
    expect(applyDiscount(100, 0.2)).toBe(80);
  });
});

describe("3. formatPriceTag", () => {
  test("formats a numeric price", () => {
    expect(formatPriceTag("Mug", 12)).toBe("Mug: $12.00");
  });
  test("price is a number", () => {
    expectTypeOf(formatPriceTag).parameter(1).toEqualTypeOf<number>();
  });
});

describe("4. shipping", () => {
  test("cost is a number, label is formatted", () => {
    expectTypeOf(shippingCost).toExtend<number>();
    expect(shippingCost).toBe(4.99);
    expect(shippingLabel).toBe("$4.99");
  });
});

describe("5. formatEuro", () => {
  test("uses the euro sign", () => {
    expect(formatEuro(3)).toBe("€3.00");
  });
});
