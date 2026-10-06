import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type LineItem,
  type Order,
  formatMoney,
  lineTotal,
  printReceipt,
  RECEIPT_WIDTH,
  row,
  subtotal,
  tax,
} from "./starter";

const order: Order = {
  id: "A-1001",
  customer: "Ada",
  taxRate: 0.08,
  items: [
    { name: "Coffee beans", unitPrice: 14.5, quantity: 2 },
    { name: "Filter papers", unitPrice: 3.99, quantity: 1 },
  ],
};

describe("types", () => {
  test("LineItem and Order shapes", () => {
    expectTypeOf<LineItem>().toEqualTypeOf<{ name: string; unitPrice: number; quantity: number }>();
    expectTypeOf<Order>().toEqualTypeOf<{
      id: string;
      customer: string;
      items: LineItem[];
      taxRate: number;
    }>();
  });

  test("function signatures", () => {
    expectTypeOf(lineTotal).toEqualTypeOf<(item: LineItem) => number>();
    expectTypeOf(subtotal).toEqualTypeOf<(order: Order) => number>();
    expectTypeOf(tax).toEqualTypeOf<(order: Order) => number>();
    expectTypeOf(formatMoney).toEqualTypeOf<(amount: number) => string>();
    expectTypeOf(row).toEqualTypeOf<(label: string, value: string) => string>();
    expectTypeOf(printReceipt).toEqualTypeOf<(order: Order) => string>();
  });
});

describe("math", () => {
  test("lineTotal", () => {
    expect(lineTotal({ name: "Beans", unitPrice: 14.5, quantity: 2 })).toBe(29);
  });
  test("subtotal", () => {
    expect(subtotal(order)).toBeCloseTo(32.99);
    expect(subtotal({ ...order, items: [] })).toBe(0);
  });
  test("tax is rounded to cents", () => {
    expect(tax(order)).toBe(2.64);
  });
});

describe("formatting", () => {
  test("formatMoney", () => {
    expect(formatMoney(3.5)).toBe("$3.50");
    expect(formatMoney(0)).toBe("$0.00");
  });

  test("row is exactly RECEIPT_WIDTH wide", () => {
    const line = row("Subtotal", "$32.99");
    expect(line).toHaveLength(RECEIPT_WIDTH);
    expect(line).toBe("Subtotal                  $32.99");
  });

  test("printReceipt", () => {
    expect(printReceipt(order)).toBe(
      [
        "Receipt #A-1001",
        "Customer: Ada",
        "--------------------------------",
        "2 x Coffee beans          $29.00",
        "1 x Filter papers          $3.99",
        "--------------------------------",
        "Subtotal                  $32.99",
        "Tax (8%)                   $2.64",
        "Total                     $35.63",
      ].join("\n"),
    );
  });
});
