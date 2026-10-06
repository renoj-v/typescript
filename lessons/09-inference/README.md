# 02.04: Inference: delete what's redundant, add what's missing

**Type:** ✍️ Write the code · **Time:** ~15 min

## Scenario

A bookshop inventory module was written by two people. One annotated *everything*, the other annotated *nothing*. Your job is to make it look like it was written by someone who understands inference.

## Part A: remove redundant annotations

These annotations repeat what TypeScript already infers. Delete them (the test reads your source to check):

- `prices: number[]`, and the `(book: Book): number` callback annotations
- `totalValue: number`, and the `(sum: number, price: number): number` callback annotations
- `let count: number = 0`

Hover over each name afterwards to confirm the inferred type is the same.

> Keep `books: Book[]`. That annotation isn't redundant, because it checks the data against `Book`. Try misspelling `price` in one of the books to see.

## Part B: add the annotations that are needed

1. `discountedPrice(price, percent)`: parameters need types (TS7006).
2. `totalsByGenre()`: `const totals = {}` is inferred as the type `{}`, an object with *no* properties, so you can't add genres to it. Annotate it as `Record<string, number>` (an object with string keys and number values).
3. `shippingFor(orderTotal)` compiles, but its inferred return type is `0 | "4.99"`. That's a bug. **Add a `: number` return annotation**, then fix the error it reveals.

## Acceptance criteria

- [ ] The redundant annotations from Part A are gone, and the inferred types are unchanged
- [ ] `discountedPrice(20, 25)` → `15`
- [ ] `totalsByGenre()` → `{ "sci-fi": 24.98, fantasy: 8.5 }` (approximately; it's floating point)
- [ ] `shippingFor` returns a `number`: `0` for orders of $50 or more, otherwise `4.99`
- [ ] All tests pass
