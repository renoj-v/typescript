import { describe, expect, expectTypeOf, test } from "vitest";
import { type Settings, loadSettingsUnsafe, parseSettings } from "./starter";

describe("loadSettingsUnsafe (the problem)", () => {
  test("happily returns data that doesn't match its type", () => {
    const settings = loadSettingsUnsafe('{"fontSize": "huge"}');
    // TypeScript says fontSize is a number. At runtime it's a string.
    expect(typeof settings.fontSize).toBe("string");
  });
});

describe("parseSettings", () => {
  test("returns valid settings", () => {
    expect(parseSettings('{"username": "ada", "fontSize": 16}')).toEqual({
      username: "ada",
      fontSize: 16,
    });
  });

  test("drops unknown extra fields", () => {
    const result = parseSettings('{"username": "ada", "fontSize": 16, "isAdmin": true}');
    expect(result).toStrictEqual({ username: "ada", fontSize: 16 });
  });

  test("rejects a missing username", () => {
    expect(() => parseSettings('{"fontSize": 16}')).toThrow(/username/);
  });

  test("rejects a wrong-typed fontSize", () => {
    expect(() => parseSettings('{"username": "ada", "fontSize": "16"}')).toThrow(/fontSize/);
  });

  test("rejects non-objects", () => {
    expect(() => parseSettings("42")).toThrow(/object/);
    expect(() => parseSettings("null")).toThrow(/object/);
  });

  test("is typed to return Settings", () => {
    expectTypeOf(parseSettings).parameter(0).toEqualTypeOf<string>();
    expectTypeOf(parseSettings).returns.toEqualTypeOf<Settings>();
  });
});
