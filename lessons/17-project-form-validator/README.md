# Lesson 17 (project): Form validator toolkit

**Time:** ~60 min · **Uses:** function types, functions that return functions, default and rest parameters, `Record`

## The spec

Build a small library of **composable validators** for a sign-up form:

```ts
const rules = {
  username: compose(required(), minLength(3), maxLength(20)),
  email: compose(required(), email()),
  password: compose(required(), minLength(8), pattern(/\d/, "Include at least one number")),
};

validateForm({ username: "al", email: "nope", password: "secret" }, rules);
// → {
//     username: "Must be at least 3 characters",
//     email: "Enter a valid email address",
//     password: "Must be at least 8 characters",
//   }
```

### Core type

```ts
type Validator = (value: string) => string | null; // null = valid, string = error message
```

### Validator factories (each returns a `Validator`)

| Factory | Fails when | Default message |
|---|---|---|
| `required(message?)` | the value is empty after trimming | `"This field is required"` |
| `minLength(min, message?)` | `value.length < min` | `` `Must be at least ${min} characters` `` |
| `maxLength(max, message?)` | `value.length > max` | `` `Must be at most ${max} characters` `` |
| `pattern(regex, message)` | the regex doesn't match | (`message` is required) |
| `email(message?)` | not `something@something.something` (build it with `pattern`) | `"Enter a valid email address"` |

### Combinators and form helpers

| Function | Behavior |
|---|---|
| `compose(...validators): Validator` | Runs validators in order and returns the **first** error, or `null` |
| `optional(validator): Validator` | An empty value is valid; otherwise run `validator` |
| `validateForm(values, rules): Record<string, string>` | Runs each rule against `values[field]` (missing fields count as `""`). Returns **only** the failing fields. |
| `isValid(errors): boolean` | `true` when there are no errors |

## Run it

```bash
npm run lesson 17
```

## Acceptance criteria

- [ ] `Validator` and every function signature match the spec
- [ ] Default messages are used when no message is passed
- [ ] `compose` stops at the first error
- [ ] All tests pass, with no `any`

## Stretch goals (untested)

1. `matches(otherField, message)`, for "confirm password". It needs access to *all* values, so how would you change `Validator`?
2. Make `validateForm` generic so `rules` keys must match `values` keys (preview of Parts 7–9).
3. An async validator, e.g. "username is taken" via a fake API: `(value: string) => Promise<string | null>`.
