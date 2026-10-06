# Lesson 05 (project): Receipt printer CLI

**Time:** ~45 min · **Uses:** annotations, interfaces, reading errors, keeping strings and numbers apart

## The spec

Build a small receipt printer for a coffee shop. `starter.ts` has the function stubs. Your job is to add the types and implement them.

### Types

```ts
interface LineItem { name: string; unitPrice: number; quantity: number }
interface Order   { id: string; customer: string; items: LineItem[]; taxRate: number } // taxRate: 0.08 = 8%
```

### Functions

| Function | Returns |
|---|---|
| `lineTotal(item)` | `unitPrice × quantity` |
| `subtotal(order)` | Sum of all line totals |
| `tax(order)` | `subtotal × taxRate`, **rounded to the nearest cent** |
| `formatMoney(amount)` | `"$32.99"`: dollar sign, always 2 decimals |
| `row(label, value)` | One 32-character line: label on the left, value right-aligned |
| `printReceipt(order)` | The full receipt below, lines joined with `"\n"` |

### Receipt format (exactly 32 characters wide)

```
Receipt #A-1001
Customer: Ada
--------------------------------
2 x Coffee beans          $29.00
1 x Filter papers          $3.99
--------------------------------
Subtotal                  $32.99
Tax (8%)                   $2.64
Total                     $35.63
```

- Item rows use the label `"<quantity> x <name>"` and the line total as the value.
- The tax label shows the rate as a whole percentage: `0.08` → `Tax (8%)`.
- `Total` is `subtotal + tax`.

### Running it

```bash
npm run lesson 5
```

This prints the sample receipt (the `import.meta.main` block at the bottom runs only when you execute the file directly, not when the tests import it), then runs the tests.

## Acceptance criteria

- [ ] `LineItem` and `Order` are exported interfaces with exactly the fields above
- [ ] Every function has typed parameters and a return type, with no `any`
- [ ] All tests pass and there are no type errors

## Stretch goals (untested)

1. **Money in cents.** Floating-point math gives `0.1 + 0.2 === 0.30000000000000004`. Refactor to store prices as integer cents (`unitPriceCents: number`) and convert only in `formatMoney`.
2. **Long names.** Truncate item names so a row never exceeds 32 characters, ending them with `…`.
3. **Real CLI input.** Read an order from a JSON file path given in `process.argv[2]`. Remember that `JSON.parse` gives you unchecked data (see Lesson 03).
