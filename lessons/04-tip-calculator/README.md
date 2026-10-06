# Lesson 04: Add types to a JS tip calculator

**Type:** 🏷️ Add types to existing JS · **Time:** ~15 min

## Scenario

This tip calculator was copied straight from a JavaScript project. Under `strict` mode, every untyped parameter is an error (TS7006). Adding types also exposes a **real bug** that the JS version has been shipping: the form values arrive as strings.

## Your task

1. Add parameter and return types to every function. Prices, percentages and people counts are `number`s.
2. Create and export an interface `BillSplit` with `total: number` and `perPerson: number`. Use it as the return type of `splitBill` and the parameter type of `formatSummary`.
3. `splitFromForm` receives raw `<input>` values, which are always `string`s. Once you type them, TypeScript shows you exactly where the bug is. Fix it by converting them with `Number(...)`.

## Acceptance criteria

- [ ] No type errors and no `any`
- [ ] `calculateTip(50, 15)` → `7.5`
- [ ] `splitBill(50, 15, 2)` → `{ total: 57.5, perPerson: 28.75 }`
- [ ] `splitFromForm("50", "15", "2")` → the same result (not `"507.5"`!)
- [ ] `formatSummary` → `"Total: $57.50 (2 × $28.75)"`. It takes a second `people: number` parameter.

<details>
<summary>Why was the JS version wrong?</summary>

In JavaScript, `"50" + 7.5` is `"507.5"`: `+` concatenates when either side is a string. Multiplication (`*`) converts strings to numbers, so the tip *looked* right, and that hid the bug.

</details>
