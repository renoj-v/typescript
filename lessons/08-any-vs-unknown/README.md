# Lesson 08: `any` vs `unknown`: make a config loader safe

**Type:** 🔧 Fix the type errors · **Time:** ~20 min

## Scenario

These helpers read values from a parsed config file. They compile with zero errors, but only because everything is typed `any`, which turns TypeScript off. Several of them crash or return wrong values on real-world input.

## Your task

1. **Replace every `any` with `unknown`.** Errors will appear. That's TypeScript finally able to help.
2. Fix each error by **checking the type at runtime** (`typeof`, `Array.isArray`, the provided `isObject` helper) so each function does what its comment says.

## Rules

- No `any` and no `as`, except inside the provided `isObject` helper (which you shouldn't need to change).

## Acceptance criteria

- [ ] No `any` left in the file
- [ ] `safeLength("abc")` → `3`; `safeLength([1, 2])` → `0`; `safeLength(null)` → `0`
- [ ] `getPort({ server: { port: 8080 } })` → `8080`; anything else (missing, `null`, `"8080"`) → `3000`
- [ ] `shoutAll(["hi", 1, "there", null])` → `["HI", "THERE"]`
- [ ] `parseJson` returns `unknown`
- [ ] All tests pass

<details>
<summary>Hint: checking nested objects</summary>

```ts
if (isObject(config) && isObject(config.server) && typeof config.server.port === "number") {
  return config.server.port; // narrowed to number
}
```

</details>

<details>
<summary>Hint: filtering an array of unknowns</summary>

Since TypeScript 5.5, `values.filter((v) => typeof v === "string")` is understood to return `string[]`, because TypeScript infers that the callback is a type check.

</details>
