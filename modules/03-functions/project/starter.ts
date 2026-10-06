// Form validator toolkit. See README.md for the full spec.

// TODO: (value: string) => string | null
export type Validator = unknown;

export function required(message) {
  throw new Error("TODO: required");
}

export function minLength(min, message) {
  throw new Error("TODO: minLength");
}

export function maxLength(max, message) {
  throw new Error("TODO: maxLength");
}

export function pattern(regex, message) {
  throw new Error("TODO: pattern");
}

export function email(message) {
  throw new Error("TODO: email");
}

export function compose(...validators) {
  throw new Error("TODO: compose");
}

export function optional(validator) {
  throw new Error("TODO: optional");
}

export function validateForm(values, rules) {
  throw new Error("TODO: validateForm");
}

export function isValid(errors) {
  throw new Error("TODO: isValid");
}

// --- Demo: runs only via `npm run exercise 03 project` ---
if (import.meta.main) {
  const rules = {
    username: compose(required(), minLength(3), maxLength(20)),
    email: compose(required(), email()),
    website: optional(pattern(/^https:\/\//, "Must start with https://")),
  };
  console.log(validateForm({ username: "al", email: "al@example.com", website: "http://x" }, rules));
}
