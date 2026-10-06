# Module 04: Object types

> ⏱ ~10 min read · Then: 5 exercises + a mini-project

## `type` vs `interface`

Both can describe object shapes:

```ts
interface Product {
  id: string;
  name: string;
  priceCents: number;
}

type Product2 = {
  id: string;
  name: string;
  priceCents: number;
};
```

For plain objects they're almost interchangeable. The differences:

| | `interface` | `type` |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Unions, tuples, primitives, functions (`"a" \| "b"`, `[x, y]`) | ❌ | ✅ |
| Extending | `interface B extends A {}` | `type B = A & {...}` |
| Declaration merging (reopening to add fields) | ✅ | ❌ |

**A practical rule:** use `interface` for object shapes that might be extended, and `type` for everything else (unions, tuples, function types, aliases). Consistency within a codebase matters more than which one you pick.

### Structural typing

TypeScript compares **shapes, not names**. Anything with the right properties fits:

```ts
function label(item: { name: string }) {
  return item.name.toUpperCase();
}
label({ id: "p1", name: "Mug", priceCents: 800 }); // ❌ excess property check (see below)
const mug: Product = { id: "p1", name: "Mug", priceCents: 800 };
label(mug); // ✅ a Product has a `name: string`
```

**Excess property checks** only apply to *fresh object literals*, to catch typos like `{ nmae: "Mug" }`. A variable with extra fields is fine.

## Optional properties

```ts
interface Customer {
  name: string;
  phone?: string; // may be missing
}

const c: Customer = { name: "Ada" };
c.phone?.trim(); // phone: string | undefined when read
```

This repo enables **`exactOptionalPropertyTypes`**. "Missing" and "present but `undefined`" are then different things:

```ts
const bad: Customer = { name: "Ada", phone: undefined }; // ❌ with exactOptionalPropertyTypes
const { phone, ...withoutPhone } = c;                    // ✅ how to remove a property
```

That matters because `"phone" in c`, `Object.keys` and JSON serialization all treat the two cases differently at runtime.

## `readonly`

```ts
interface Order {
  readonly id: string;
  readonly lines: readonly OrderLine[]; // the array can't be pushed to
}

order.id = "x";           // ❌ Cannot assign to 'id' because it is a read-only property
order.lines.push(line);   // ❌ Property 'push' does not exist on type 'readonly OrderLine[]'
const next: Order = { ...order, lines: [...order.lines, line] }; // ✅ copy instead
```

- `readonly` is **compile-time only**. At runtime the object is as mutable as ever (use `Object.freeze` if you need runtime protection).
- It's **shallow**: `readonly lines` stops reassigning `lines`, but not `lines[0].quantity = 5`. Mark nested fields `readonly` too.
- `Readonly<Order>` makes every top-level property readonly.

## Index signatures and `Record`

Use an index signature when you don't know the keys in advance:

```ts
type Inventory = { [sku: string]: number };
// same as:
type Inventory2 = Record<string, number>;

const stock: Inventory = { "MUG-1": 12, "TEE-M": 0 };
const mugs = stock["MUG-1"]; // number | undefined (noUncheckedIndexedAccess)
```

`Record<K, V>` with a **union of keys** requires *every* key:

```ts
type Size = "S" | "M" | "L";
const prices: Record<Size, number> = { S: 10, M: 12 }; // ❌ Property 'L' is missing
```

## Extending and intersecting

```ts
interface BaseUser { id: number; email: string }
interface Customer extends BaseUser { loyaltyPoints: number }

type Timestamps = { createdAt: Date; updatedAt: Date };
type StoredCustomer = Customer & Timestamps; // has all fields of both
```

- `extends` reports conflicts clearly, at the declaration.
- `&` combines anything, but conflicting properties silently become `never`: `{ id: string } & { id: number }` has `id: never`, so you can't build one.

## ⚠️ Types disappear at runtime

An `interface` produces **no JavaScript at all**, so you can't loop over its keys or check `x instanceof Product`. `readonly` doesn't freeze anything. When objects come from JSON or an API, their shape still has to be checked at runtime (Module 12).

## Common mistakes

- **Expecting `readonly` to be deep or to work at runtime.** It's shallow and compile-time only.
- **Assigning `undefined` to an optional property** under `exactOptionalPropertyTypes`. Omit the key instead.
- **Forgetting that `record[key]` may be `undefined`.** Handle it with `??` or a check.
- **Mutating objects that are typed `readonly`, via a cast.** If you cast away `readonly`, you've lost the guarantee.
- **Using `&` to "override" a property type.** You get `never`, not an override. Use `Omit` (Module 08) and then add the field back.
- **Making everything optional "to be safe".** Every `?` is an `undefined` check somewhere else. Model what's really required.

## Check your understanding

1. Name one thing `type` can do that `interface` can't, and one thing `interface` can do that `type` can't.
2. Why does `label({ id: "p1", name: "Mug" })` error when `label(mug)` (with the same object stored in a variable) doesn't?
3. With `exactOptionalPropertyTypes`, what's the difference between `{}` and `{ phone: undefined }` for `phone?: string`?
4. Does `readonly lines: OrderLine[]` stop `order.lines.push(x)`? What would?
5. What's the type of `id` in `{ id: string } & { id: number }`, and why?

<details>
<summary>Answers</summary>

1. `type` can name unions, tuples, primitives and function types. `interface` supports declaration merging (reopening to add fields).
2. Excess property checks only apply to fresh object literals. They catch typos where you wrote the object. A variable may legitimately have more fields than a parameter needs.
3. `{}` has no `phone` key. `{ phone: undefined }` has the key with an `undefined` value, which `exactOptionalPropertyTypes` rejects. They behave differently with `in`, `Object.keys` and JSON.
4. No. That only stops reassigning `order.lines`. `readonly lines: readonly OrderLine[]` (or `ReadonlyArray<OrderLine>`) removes `push`.
5. `never`. An intersection requires both, and no value is both a `string` and a `number`.

</details>

## Handbook links

- [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Differences between type aliases and interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
- [Index signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)
- [Extending types](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types) and [Intersection types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)
- [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes)
