# 01.02: Read the error

**Type:** 🔧 Fix the type errors · **Time:** ~15 min

## Scenario

An online shop's price-formatting helpers are full of type errors. Each one is a different **classic TypeScript error**, the kind you'll see every week. The goal is to get fast at *reading* the message, not just making it go away.

## Your task

`starter.ts` has five sections, each with one error. For each one:

1. Read the full error message (run `npm run exercise 01 02`, or hover in your editor).
2. Find the matching row in the table below and **predict the fix before you make it**.
3. Fix it so the behavior matches the comment above the function.

| Code | Message (shortened) | Meaning |
|---|---|---|
| TS7006 | Parameter 'x' implicitly has an 'any' type | Add a type annotation |
| TS18048 | 'x' is possibly 'undefined' | Handle the missing case |
| TS2339 | Property 'x' does not exist on type 'Y' | Wrong type, or a typo |
| TS2345 | Argument of type 'X' is not assignable to parameter of type 'Y' | Wrong value passed in |
| TS2554 | Expected 2 arguments, but got 1 | Wrong argument count |

## Rules

- Don't change `formatPrice`.
- No `any`, `as`, or `// @ts-ignore`.

## Acceptance criteria

- [ ] No type errors in `starter.ts`
- [ ] `formatTotal([1.5, 2.25])` → `"$3.75"`
- [ ] `applyDiscount(100)` → `100`; `applyDiscount(100, 0.2)` → `80`
- [ ] `formatPriceTag("Mug", 12)` → `"Mug: $12.00"`
- [ ] `shippingCost` is a **number** and `shippingLabel` is `"$4.99"`
- [ ] `formatEuro(3)` → `"€3.00"`

<details>
<summary>Hint for TS18048</summary>

An optional parameter `discount?: number` has type `number | undefined`. Either give it a default value (`discount = 0`) or check for `undefined` before using it.

</details>

<details>
<summary>Hint for TS2339</summary>

Sometimes the property is real but the *type* is wrong. Which type has a `toFixed` method? What should the price parameter's type be?

</details>
