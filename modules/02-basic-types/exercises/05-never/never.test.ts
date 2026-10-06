import { describe, expect, expectTypeOf, test } from "vitest";
import { type OrderStatus, assertNever, fail, requireEnv, statusLabel } from "./starter";

describe("fail", () => {
  test("returns never and throws", () => {
    expectTypeOf(fail).returns.toBeNever();
    expect(() => fail("boom")).toThrow("boom");
  });
});

describe("requireEnv", () => {
  test("returns present values", () => {
    expect(requireEnv({ PORT: "8080" }, "PORT")).toBe("8080");
  });
  test("throws for missing values", () => {
    expect(() => requireEnv({}, "DATABASE_URL")).toThrow(/DATABASE_URL/);
  });
});

describe("assertNever", () => {
  test("only accepts never", () => {
    expectTypeOf(assertNever).parameter(0).toBeNever();
    expectTypeOf(assertNever).toEqualTypeOf<(value: never) => never>();
    // @ts-expect-error - a real status is not `never`
    expectTypeOf(assertNever).toBeCallableWith("pending");
  });
  test("throws at runtime if bad data gets through", () => {
    expect(() => assertNever("surprise" as never)).toThrow(/surprise/);
  });
});

describe("statusLabel", () => {
  test.each<[OrderStatus, string]>([
    ["pending", "⏳ Pending"],
    ["shipped", "🚚 Shipped"],
    ["delivered", "📦 Delivered"],
  ])("%s", (status, label) => {
    expect(statusLabel(status)).toBe(label);
  });
});
