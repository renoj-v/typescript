import { describe, expect, expectTypeOf, test } from "vitest";
import { formatAmount, makeDate } from "./starter";

describe("makeDate", () => {
  test("from an ISO string", () => {
    expect(makeDate("2026-03-15").toISOString()).toBe("2026-03-15T00:00:00.000Z");
  });

  test("from year, month (1-12), day", () => {
    expect(makeDate(2026, 3, 15).toISOString()).toBe("2026-03-15T00:00:00.000Z");
  });

  test("invalid dates throw", () => {
    expect(() => makeDate("not a date")).toThrow(RangeError);
  });

  test("only the two call shapes are allowed", () => {
    expectTypeOf(makeDate).toBeCallableWith("2026-03-15");
    expectTypeOf(makeDate).toBeCallableWith(2026, 3, 15);
    // @ts-expect-error - year and month without a day
    expectTypeOf(makeDate).toBeCallableWith(2026, 3);
    // @ts-expect-error - an ISO string with extra arguments
    expectTypeOf(makeDate).toBeCallableWith("2026-03-15", 1, 1);
  });
});

describe("formatAmount", () => {
  test("a single number", () => {
    const result = formatAmount(4.5);
    expectTypeOf(result).toEqualTypeOf<string>();
    expect(result).toBe("$4.50");
  });

  test("an array of numbers", () => {
    const result = formatAmount([4.5, 10]);
    expectTypeOf(result).toEqualTypeOf<string[]>();
    expect(result).toEqual(["$4.50", "$10.00"]);
  });
});
