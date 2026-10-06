import { readFileSync } from "node:fs";
import { describe, expect, expectTypeOf, test } from "vitest";
import { getPort, parseJson, safeLength, shoutAll } from "./starter";

describe("no more any", () => {
  test("parameters and return types use unknown", () => {
    expectTypeOf(safeLength).parameter(0).toBeUnknown();
    expectTypeOf(getPort).parameter(0).toBeUnknown();
    expectTypeOf(shoutAll).parameter(0).toEqualTypeOf<unknown[]>();
    expectTypeOf(parseJson).returns.toBeUnknown();
  });

  test("the file contains no `any`", () => {
    const source = readFileSync(new URL("./starter.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/:\s*any\b/);
  });
});

describe("safeLength", () => {
  test("strings", () => {
    expect(safeLength("abc")).toBe(3);
  });
  test("non-strings are 0", () => {
    expect(safeLength([1, 2])).toBe(0);
    expect(safeLength(42)).toBe(0);
    expect(safeLength(null)).toBe(0);
    expect(safeLength(undefined)).toBe(0);
  });
});

describe("getPort", () => {
  test("reads a numeric port", () => {
    expect(getPort({ server: { port: 8080 } })).toBe(8080);
  });
  test("falls back to 3000", () => {
    expect(getPort({})).toBe(3000);
    expect(getPort(null)).toBe(3000);
    expect(getPort({ server: null })).toBe(3000);
    expect(getPort({ server: { port: "8080" } })).toBe(3000);
    expect(getPort(parseJson('{"server": {}}'))).toBe(3000);
  });
});

describe("shoutAll", () => {
  test("upper-cases strings and skips the rest", () => {
    expect(shoutAll(["hi", 1, "there", null])).toEqual(["HI", "THERE"]);
  });
});
