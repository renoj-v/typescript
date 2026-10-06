# 04.01: Model a product catalog with `type` and `interface`

**Type:** ✍️ Write the code · **Time:** ~20 min

## Scenario

A small online shop sells books, games and music. Model its catalog, then write a few query helpers.

## Your task

1. **Types.** Pick `interface` or `type` for each, using the guideline from the lesson:
   - `Category`: one of `"books"`, `"games"` or `"music"`. (Which keyword *has* to be used for a union?)
   - `Product`: `id: string`, `name: string`, `priceCents: number`, `category: Category`
   - `Catalog`: `currency: string`, `products: Product[]`
2. **Functions:**
   - `addProduct(catalog, product): Catalog` returns a **new** catalog with the product appended. Throw an `Error` mentioning the id if a product with that id already exists.
   - `byCategory(catalog, category): Product[]` returns the products in that category.
   - `cheapest(catalog): Product | undefined` returns the lowest-priced product, or `undefined` for an empty catalog.
   - `label(item: { name: string; priceCents: number }, currency: string): string` returns `"Dune — 9.99 USD"`.

   Notice that `label` doesn't mention `Product` at all, yet you can pass it a `Product`. That's structural typing.

## Acceptance criteria

- [ ] `{ ..., category: "movies" }` is not a valid `Product`
- [ ] `addProduct` never mutates the catalog it's given
- [ ] `label` accepts a `Product`, or any object with `name` and `priceCents`
- [ ] All tests pass
