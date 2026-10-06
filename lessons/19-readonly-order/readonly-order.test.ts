import { describe, expect, test } from "vitest";
import { type Order, addLine, clearNote, setNote, totalQuantity } from "./starter";

/** Freeze an order deeply, so any mutation throws at runtime. */
function frozen(order: Order): Order {
  order.lines.forEach((line) => Object.freeze(line));
  Object.freeze(order.lines);
  return Object.freeze(order);
}

const makeOrder = (): Order =>
  frozen({ id: "o1", lines: [{ sku: "MUG", quantity: 1 }], note: "Gift wrap please" });

describe("addLine", () => {
  test("appends a new SKU", () => {
    const order = makeOrder();
    const next = addLine(order, "TEE", 2);
    expect(next.lines).toEqual([
      { sku: "MUG", quantity: 1 },
      { sku: "TEE", quantity: 2 },
    ]);
    expect(order.lines).toHaveLength(1);
  });

  test("increases the quantity of an existing SKU", () => {
    const order = makeOrder();
    const next = addLine(order, "MUG", 3);
    expect(next.lines).toEqual([{ sku: "MUG", quantity: 4 }]);
    expect(order.lines[0]?.quantity).toBe(1);
    expect(totalQuantity(next)).toBe(4);
  });
});

describe("notes", () => {
  test("setNote returns a new order", () => {
    const order = makeOrder();
    const next = setNote(order, "Leave at the door");
    expect(next.note).toBe("Leave at the door");
    expect(order.note).toBe("Gift wrap please");
  });

  test("clearNote removes the key entirely", () => {
    const order = makeOrder();
    const next = clearNote(order);
    expect("note" in next).toBe(false);
    expect(next).toEqual({ id: "o1", lines: [{ sku: "MUG", quantity: 1 }] });
    expect(order.note).toBe("Gift wrap please");
  });
});
