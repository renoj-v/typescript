# Lesson 15: Overloads, where the output depends on the input

**Type:** ✍️ Write the code · **Time:** ~20 min

## Scenario

A booking app needs two helpers with flexible call styles:

```ts
makeDate("2026-03-15");     // from an ISO string
makeDate(2026, 3, 15);      // from year, month (1-12), day
makeDate(2026, 3);          // ❌ should NOT compile

formatAmount(4.5);          // "$4.50"            → string
formatAmount([4.5, 10]);    // ["$4.50", "$10.00"] → string[]
```

## Your task

1. **`makeDate`**: add **two overload signatures** above the implementation:
   - `(iso: string): Date`
   - `(year: number, month: number, day: number): Date`

   Then implement it. Build dates in **UTC** (`new Date(Date.UTC(year, month - 1, day))`), so results don't depend on your time zone. Throw a `RangeError` if the result is an invalid date (`Number.isNaN(date.getTime())`).
2. **`formatAmount`**: add overloads so that a `number` gives back a `string`, and a `number[]` gives back a `string[]`. Implement it using `$` and 2 decimals.

## Acceptance criteria

- [ ] `makeDate(2026, 3)` and `makeDate("2026-03-15", 1, 1)` are compile errors
- [ ] `formatAmount(1)` has type `string`; `formatAmount([1])` has type `string[]`
- [ ] Invalid dates throw `RangeError`
- [ ] All tests pass

> 💡 **When *not* to use overloads:** `makeDate` always returns `Date`, so a union parameter could work too. Overloads earn their keep here only because they *forbid* the 2-argument call. `formatAmount` is the classic case, because the return type changes.

<details>
<summary>Hint: overload syntax</summary>

```ts
export function pad(value: string): string;
export function pad(value: number, width: number): string;
export function pad(value: string | number, width?: number): string {
  // implementation, which callers can't see
}
```

</details>
