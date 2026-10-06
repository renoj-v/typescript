import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type Point,
  type PriceRange,
  type RGB,
  distance,
  midpoint,
  pairUp,
  parseHexColor,
  priceRange,
} from "./starter";

describe("tuple types", () => {
  test("shapes", () => {
    expectTypeOf<Point>().toEqualTypeOf<[number, number]>();
    expectTypeOf<PriceRange>().toEqualTypeOf<[number, number]>();
    expectTypeOf<RGB>().toEqualTypeOf<readonly [number, number, number]>();
  });

  test("a Point has exactly two numbers", () => {
    // @ts-expect-error - three numbers is not a Point
    const tooLong: Point = [1, 2, 3];
    // @ts-expect-error - one number is not a Point
    const tooShort: Point = [1];
    expect([tooLong, tooShort]).toBeDefined();
  });

  test("an RGB is readonly", () => {
    const color: RGB = [1, 2, 3];
    // @ts-expect-error - readonly tuples can't be modified
    color[0] = 9;
    expect(color).toBeDefined();
  });

  test("function signatures", () => {
    expectTypeOf(distance).toEqualTypeOf<(a: Point, b: Point) => number>();
    expectTypeOf(midpoint).toEqualTypeOf<(a: Point, b: Point) => Point>();
    expectTypeOf(priceRange).toEqualTypeOf<(prices: number[]) => PriceRange>();
    expectTypeOf(parseHexColor).toEqualTypeOf<(hex: string) => RGB>();
    expectTypeOf(pairUp).returns.toEqualTypeOf<[string, number][]>();
  });
});

describe("points", () => {
  test("distance", () => {
    expect(distance([0, 0], [3, 4])).toBe(5);
  });
  test("midpoint", () => {
    expect(midpoint([0, 0], [4, -2])).toEqual([2, -1]);
  });
});

describe("priceRange", () => {
  test("finds min and max", () => {
    expect(priceRange([12, 3.5, 40, 8])).toEqual([3.5, 40]);
  });
  test("throws on an empty list", () => {
    expect(() => priceRange([])).toThrow();
  });
});

describe("parseHexColor", () => {
  test("parses #rrggbb", () => {
    expect(parseHexColor("#ff8800")).toEqual([255, 136, 0]);
    expect(parseHexColor("#00FFaa")).toEqual([0, 255, 170]);
  });
  test("rejects bad input", () => {
    expect(() => parseHexColor("ff8800")).toThrow();
    expect(() => parseHexColor("#ff88")).toThrow();
    expect(() => parseHexColor("#gg0000")).toThrow();
  });
});

describe("pairUp", () => {
  test("zips to the shorter length", () => {
    expect(pairUp(["tea", "coffee", "cake"], [2, 3])).toEqual([
      ["tea", 2],
      ["coffee", 3],
    ]);
  });
});
