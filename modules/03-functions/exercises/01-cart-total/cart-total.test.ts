import { describe, expect, expectTypeOf, test } from "vitest";
import { type CartItem, cartSubtotal, cartTotal, describeCart, lineTotal } from "./starter";

const items: CartItem[] = [
  { name: "Notebook", price: 4.5, quantity: 2 },
  { name: "Pen set", price: 18, quantity: 1 },
];

describe("types", () => {
  test("CartItem", () => {
    expectTypeOf<CartItem>().toEqualTypeOf<{ name: string; price: number; quantity: number }>();
  });

  test("helpers", () => {
    expectTypeOf(lineTotal).toEqualTypeOf<(item: CartItem) => number>();
    expectTypeOf(cartSubtotal).toEqualTypeOf<(items: CartItem[]) => number>();
  });

  test("cartTotal has an optional discount and a default tax rate", () => {
    expectTypeOf(cartTotal).toBeCallableWith(items);
    expectTypeOf(cartTotal).toBeCallableWith(items, 10);
    expectTypeOf(cartTotal).toBeCallableWith(items, 10, 0.2);
    expectTypeOf(cartTotal).returns.toEqualTypeOf<number>();
    // @ts-expect-error - items are required
    expectTypeOf(cartTotal).toBeCallableWith();
    // @ts-expect-error - the discount is a number, not a string
    expectTypeOf(cartTotal).toBeCallableWith(items, "10");
  });

  test("describeCart has a default currency", () => {
    expectTypeOf(describeCart).toBeCallableWith(items);
    expectTypeOf(describeCart).toBeCallableWith(items, "€");
    expectTypeOf(describeCart).returns.toEqualTypeOf<string>();
    // @ts-expect-error - currency is a string
    expectTypeOf(describeCart).toBeCallableWith(items, 1);
  });
});

describe("cartTotal", () => {
  test("adds 10% tax by default", () => {
    expect(cartTotal(items)).toBe(29.7);
  });
  test("applies a discount before tax", () => {
    expect(cartTotal(items, 10)).toBe(26.73);
  });
  test("custom tax rate", () => {
    expect(cartTotal(items, 0, 0)).toBe(27);
  });
});

describe("describeCart", () => {
  test("summarizes the cart without NaN", () => {
    expect(describeCart(items, "€")).toBe("3 items, total €29.70");
    expect(describeCart(items)).toBe("3 items, total $29.70");
  });
  test("singular", () => {
    expect(describeCart([{ name: "Pen", price: 1, quantity: 1 }])).toBe("1 item, total $1.10");
  });
  test("empty cart", () => {
    expect(describeCart([])).toBe("Your cart is empty");
  });
});
