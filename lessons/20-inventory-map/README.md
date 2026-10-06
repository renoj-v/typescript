# Lesson 20: Inventory with index signatures and `Record`

**Type:** ✍️ Write the code · **Time:** ~20 min

## Scenario

A warehouse tracks stock as a map from SKU to quantity:

```ts
const stock: Inventory = { "MUG-1": 12, "TEE-M": 0, "CAP-1": 3 };
```

SKUs are unknown in advance, so this is a job for an **index signature**. The stock report, by contrast, has a fixed set of keys, which is a job for **`Record` with a union**.

## Your task

1. **Types**
   - `Inventory`: string keys (SKUs) → number values
   - `StockLevel`: `"out" | "low" | "ok"`
   - `StockReport`: an object with **exactly** the keys of `StockLevel`, each holding a `string[]` of SKUs. Use `Record`.
2. **Functions** (none of them may mutate their inputs)
   - `quantityOf(inventory, sku): number` returns the quantity, or `0` for unknown SKUs.
   - `restock(inventory, sku, amount): Inventory` returns a new inventory with `amount` added (it may be a new SKU).
   - `merge(...inventories): Inventory` adds up quantities across any number of inventories.
   - `stockReport(inventory, lowThreshold): StockReport` sorts every SKU into a level: `0` → `"out"`, `≤ lowThreshold` → `"low"`, otherwise `"ok"`. Each list is sorted alphabetically.

## Acceptance criteria

- [ ] A `StockReport` missing one of its keys is a type error
- [ ] `quantityOf` handles missing SKUs (remember that `inventory[sku]` is `number | undefined`)
- [ ] All tests pass

<details>
<summary>Hint: looping over a Record</summary>

`Object.entries(inventory)` gives you `[string, number][]`, already typed for you.

</details>
