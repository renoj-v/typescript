# Lesson 19: An immutable order with `readonly` and optional properties

**Type:** 🔧 Fix the type errors · **Time:** ~20 min

## Scenario

The order types are marked `readonly`, because the team wants orders to be **immutable**: every change produces a new order object. That makes undo, change history and React state updates easy. The helper functions were written before that decision, and they mutate in place.

## Your task

Fix every type error in `starter.ts`. **Don't change the interfaces.** The functions should copy instead of mutating:

1. `addLine(order, sku, quantity)` returns a new order. If the SKU is already there, the new order has that line's quantity increased. Otherwise the line is appended.
2. `setNote(order, note)` returns a new order with the note.
3. `clearNote(order)` returns a new order with **no `note` key at all**. Watch for `exactOptionalPropertyTypes`.

## Acceptance criteria

- [ ] No type errors and no changes to the interfaces
- [ ] No casts (`as`) and no `// @ts-ignore`
- [ ] The original order is never changed (the tests freeze it with `Object.freeze`)
- [ ] `"note" in clearNote(order)` is `false`
- [ ] All tests pass

<details>
<summary>Hint: updating one item in a readonly array</summary>

```ts
const lines = order.lines.map((line) =>
  line.sku === sku ? { ...line, quantity: line.quantity + quantity } : line,
);
```

</details>

<details>
<summary>Hint: removing a property</summary>

Destructure it out: `const { note, ...rest } = order;`, then return `rest`. Name the unused variable `_note` to keep the linter quiet.

</details>
