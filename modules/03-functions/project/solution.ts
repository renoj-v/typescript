// Form validator toolkit: reference solution.

// One small function type is the whole "framework". Every helper below
// either *returns* a Validator or *combines* Validators.
export type Validator = (value: string) => string | null;

// Default parameters give every factory a sensible message while still
// letting callers override it.
export function required(message = "This field is required"): Validator {
  return (value) => (value.trim() === "" ? message : null);
}

// A default can refer to earlier parameters, so the message can mention `min`.
export function minLength(min: number, message = `Must be at least ${min} characters`): Validator {
  return (value) => (value.length < min ? message : null);
}

export function maxLength(max: number, message = `Must be at most ${max} characters`): Validator {
  return (value) => (value.length > max ? message : null);
}

// No default here. A generic "invalid format" message helps nobody,
// so the type makes `message` required.
export function pattern(regex: RegExp, message: string): Validator {
  return (value) => (regex.test(value) ? null : message);
}

// Built from `pattern`: small functions compose into bigger ones.
export function email(message = "Enter a valid email address"): Validator {
  return pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message);
}

// A rest parameter collects any number of validators into an array.
export function compose(...validators: Validator[]): Validator {
  return (value) => {
    for (const validate of validators) {
      const error = validate(value);
      if (error !== null) return error;
    }
    return null;
  };
}

export function optional(validator: Validator): Validator {
  return (value) => (value === "" ? null : validator(value));
}

export function validateForm(
  values: Record<string, string>,
  rules: Record<string, Validator>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [field, validate] of Object.entries(rules)) {
    // `values[field]` is `string | undefined` (noUncheckedIndexedAccess),
    // and a missing field is treated as empty.
    const error = validate(values[field] ?? "");
    if (error !== null) errors[field] = error;
  }
  return errors;
}

export function isValid(errors: Record<string, string>): boolean {
  return Object.keys(errors).length === 0;
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
