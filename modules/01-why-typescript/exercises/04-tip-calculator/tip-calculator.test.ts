import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type BillSplit,
  calculateTip,
  formatSummary,
  splitBill,
  splitFromForm,
  TIP_PRESETS,
} from "./starter";

describe("runtime behavior", () => {
  test("calculateTip", () => {
    expect(calculateTip(50, 15)).toBe(7.5);
    expect(calculateTip(0, 20)).toBe(0);
  });

  test("splitBill", () => {
    expect(splitBill(50, 15, 2)).toEqual({ total: 57.5, perPerson: 28.75 });
  });

  test("splitFromForm converts strings to numbers", () => {
    expect(splitFromForm("50", "15", "2")).toEqual({ total: 57.5, perPerson: 28.75 });
  });

  test("formatSummary", () => {
    expect(formatSummary({ total: 57.5, perPerson: 28.75 }, 2)).toBe("Total: $57.50 (2 × $28.75)");
  });
});

describe("types", () => {
  test("presets are numbers", () => {
    expectTypeOf(TIP_PRESETS).toEqualTypeOf<number[]>();
  });

  test("BillSplit has the right shape", () => {
    expectTypeOf<BillSplit>().toEqualTypeOf<{ total: number; perPerson: number }>();
  });

  test("function signatures", () => {
    expectTypeOf(calculateTip).toEqualTypeOf<(bill: number, percent: number) => number>();
    expectTypeOf(splitBill).parameters.toEqualTypeOf<[number, number, number]>();
    expectTypeOf(splitBill).returns.toEqualTypeOf<BillSplit>();
    expectTypeOf(formatSummary).parameters.toEqualTypeOf<[BillSplit, number]>();
    expectTypeOf(formatSummary).returns.toEqualTypeOf<string>();
    expectTypeOf(splitFromForm).parameters.toEqualTypeOf<[string, string, string]>();
    expectTypeOf(splitFromForm).returns.toEqualTypeOf<BillSplit>();
  });
});
