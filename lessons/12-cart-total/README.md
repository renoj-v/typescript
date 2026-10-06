# 03.01: Type a shopping cart

**Type:** 🏷️ Add types to existing JS · **Time:** ~15 min

## Scenario

These cart helpers come from an untyped checkout page. Add types, including optional and default parameters, and the compiler will point you to a bug customers have been hitting: some carts show a total of `$NaN`.

## Your task

1. Export an interface `CartItem` with `name: string`, `price: number` and `quantity: number`.
2. Type every parameter and return value:
   - `cartTotal(items, discountPercent?, taxRate = 0.1)`: `discountPercent` is **optional** (a number like `15` for 15% off). `taxRate` **defaults** to `0.1`.
   - `describeCart(items, currency = "$")`: `currency` defaults to `"$"`.
3. Once it's typed, TypeScript reports an error inside `describeCart`. That's the `$NaN` bug. Fix it.

## Acceptance criteria

- [ ] `cartTotal(items)`, `cartTotal(items, 10)` and `cartTotal(items, 10, 0.2)` all compile; `cartTotal()` doesn't
- [ ] `cartTotal` returns a number rounded to cents
- [ ] `describeCart(items, "€")` → `"3 items, total €29.70"` (singular: `"1 item, …"`)
- [ ] `describeCart([])` → `"Your cart is empty"`
- [ ] No `any`; all tests pass
