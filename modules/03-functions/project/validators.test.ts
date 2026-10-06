import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type Validator,
  compose,
  email,
  isValid,
  maxLength,
  minLength,
  optional,
  pattern,
  required,
  validateForm,
} from "./starter";

describe("types", () => {
  test("Validator", () => {
    expectTypeOf<Validator>().toEqualTypeOf<(value: string) => string | null>();
  });

  test("factories return validators", () => {
    expectTypeOf(required).returns.toEqualTypeOf<Validator>();
    expectTypeOf(minLength).returns.toEqualTypeOf<Validator>();
    expectTypeOf(maxLength).returns.toEqualTypeOf<Validator>();
    expectTypeOf(pattern).toEqualTypeOf<(regex: RegExp, message: string) => Validator>();
    expectTypeOf(email).returns.toEqualTypeOf<Validator>();
    expectTypeOf(compose).toEqualTypeOf<(...validators: Validator[]) => Validator>();
    expectTypeOf(optional).toEqualTypeOf<(validator: Validator) => Validator>();
  });

  test("messages are optional (except for pattern)", () => {
    expectTypeOf(required).toBeCallableWith();
    expectTypeOf(minLength).toBeCallableWith(3);
    expectTypeOf(minLength).toBeCallableWith(3, "Too short");
    // @ts-expect-error - minLength needs a minimum
    expectTypeOf(minLength).toBeCallableWith();
    // @ts-expect-error - pattern needs a message
    expectTypeOf(pattern).toBeCallableWith(/x/);
  });

  test("form helpers", () => {
    expectTypeOf(validateForm).toEqualTypeOf<
      (values: Record<string, string>, rules: Record<string, Validator>) => Record<string, string>
    >();
    expectTypeOf(isValid).toEqualTypeOf<(errors: Record<string, string>) => boolean>();
  });
});

describe("validators", () => {
  test("required", () => {
    expect(required()("")).toBe("This field is required");
    expect(required()("   ")).toBe("This field is required");
    expect(required("Name please")("")).toBe("Name please");
    expect(required()("Ada")).toBeNull();
  });

  test("minLength / maxLength", () => {
    expect(minLength(3)("al")).toBe("Must be at least 3 characters");
    expect(minLength(3)("ada")).toBeNull();
    expect(maxLength(5)("abcdef")).toBe("Must be at most 5 characters");
    expect(maxLength(5, "Too long")("abcdef")).toBe("Too long");
    expect(maxLength(5)("abc")).toBeNull();
  });

  test("pattern and email", () => {
    expect(pattern(/\d/, "Need a number")("abc")).toBe("Need a number");
    expect(pattern(/\d/, "Need a number")("abc1")).toBeNull();
    expect(email()("ada@example.com")).toBeNull();
    expect(email()("ada@example")).toBe("Enter a valid email address");
    expect(email("Bad email")("nope")).toBe("Bad email");
  });

  test("compose returns the first error", () => {
    const username = compose(required(), minLength(3), maxLength(5));
    expect(username("")).toBe("This field is required");
    expect(username("al")).toBe("Must be at least 3 characters");
    expect(username("alexandra")).toBe("Must be at most 5 characters");
    expect(username("alex")).toBeNull();
    expect(compose()("anything")).toBeNull();
  });

  test("optional", () => {
    const website = optional(pattern(/^https:\/\//, "Must start with https://"));
    expect(website("")).toBeNull();
    expect(website("http://x")).toBe("Must start with https://");
    expect(website("https://x")).toBeNull();
  });
});

describe("validateForm", () => {
  const rules = {
    username: compose(required(), minLength(3), maxLength(20)),
    email: compose(required(), email()),
    password: compose(required(), minLength(8), pattern(/\d/, "Include at least one number")),
  };

  test("returns only failing fields", () => {
    expect(validateForm({ username: "al", email: "nope", password: "secret" }, rules)).toEqual({
      username: "Must be at least 3 characters",
      email: "Enter a valid email address",
      password: "Must be at least 8 characters",
    });
    expect(validateForm({ username: "ada", email: "ada@example.com", password: "password" }, rules)).toEqual({
      password: "Include at least one number",
    });
  });

  test("missing fields count as empty", () => {
    expect(validateForm({}, { username: required() })).toEqual({ username: "This field is required" });
  });

  test("isValid", () => {
    expect(isValid({})).toBe(true);
    expect(isValid({ email: "Bad" })).toBe(false);
  });
});
