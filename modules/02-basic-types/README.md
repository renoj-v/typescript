# Module 02: Basic types

> ⏱ ~10 min read · Then: 5 exercises + a mini-project

## Primitives

```ts
const title: string = "Dune";
const price: number = 9.99;       // integers and decimals are both `number`
const inStock: boolean = true;
const isbn: bigint = 9780441013593n;
const nothing: null = null;
const notSet: undefined = undefined;
```

Always use the **lowercase** names. `String`, `Number` and `Boolean` are JavaScript wrapper objects, which you almost never want.

## Arrays and tuples

```ts
const tags: string[] = ["sale", "new"];
const ratings: Array<number> = [5, 4, 5]; // same as number[]
const sizes: readonly string[] = ["S", "M", "L"]; // no push/pop/assignment

// A tuple is a fixed-length array where each position has its own type.
const point: [number, number] = [51.5, -0.12];
const entry: [name: string, price: number] = ["Coffee", 3.5]; // labels are just docs
const [label, cost] = entry; // label: string, cost: number
```

Use a tuple for **short, positional** data, like coordinates or `[key, value]` pairs. If you need more than about three positions, use an object with named fields instead.

### `noUncheckedIndexedAccess` (on in this repo)

```ts
const first = tags[0]; // string | undefined. The array might be empty!
first.toUpperCase();   // ❌ 'first' is possibly 'undefined'
if (first !== undefined) first.toUpperCase(); // ✅
```

That's annoying at first, but it matches reality: `[][0]` *is* `undefined` at runtime. Tuples don't have this problem, because their length is known.

## Object types

```ts
const book: { title: string; price: number; tags: string[] } = {
  title: "Dune",
  price: 9.99,
  tags: ["sci-fi"],
};

// Usually you name the shape (Module 04 goes deeper):
type Book = { title: string; price: number; tags: string[] };
```

## `any`, `unknown` and `never`

| Type | Meaning | Use it when… |
|---|---|---|
| `any` | "Stop checking." Anything goes, in and out. | Almost never. It switches TypeScript off and spreads silently. |
| `unknown` | "Could be anything; prove it before use." | Data from outside: `JSON.parse`, `catch (err)`, APIs. |
| `never` | "This can't happen." No value has this type. | Functions that always throw; impossible code paths. |

```ts
const a: any = JSON.parse("42");
a.toUpperCase(); // compiles, then 💥 crashes at runtime

const u: unknown = JSON.parse("42");
u.toUpperCase(); // ❌ compile error: 'u' is of type 'unknown'
if (typeof u === "string") u.toUpperCase(); // ✅ narrowed to string
```

`never` shows up when you've ruled out every possibility:

```ts
function fail(message: string): never {
  throw new Error(message);
}

const port = process.env.PORT ?? fail("PORT is not set"); // port: string
```

Because `never` means "this never produces a value", TypeScript can treat it as assignable to every type. That's why `?? fail(...)` leaves `string` behind.

You'll also see a tiny preview of **union types** in this module: `"pending" | "shipped"` means "one of these two strings". Modules 05 and 06 cover them properly.

## Type inference: when to annotate

TypeScript infers types from values, so you don't need to annotate everything:

```ts
let count = 0;              // number
const names = ["Ada", "Al"]; // string[]
const city = "Paris";        // "Paris": a const can never change, so it gets the literal type
const total = [1, 2].reduce((sum, n) => sum + n, 0); // number
["a"].map((s) => s.length); // `s` is contextually typed as string
```

**Do annotate:**

- **Function parameters**: TypeScript can't infer them from the body.
- **Return types of exported functions**: they document your intent and catch mistakes inside the function, rather than at a distant call site.
- **Empty values that start untyped**: `const totals: Record<string, number> = {}`.
- **Data you want checked against a shape**: `const sample: Order = { ... }`.

**Don't annotate** what's already obvious from the right-hand side (`const count: number = 0`). It's noise, and the typescript-eslint rule `no-inferrable-types` will flag it.

## ⚠️ Remember: types are compile-time only

`const scores: number[] = JSON.parse(text)` compiles, because `JSON.parse` returns `any`. But nothing checks that the JSON really contained numbers. Store it as `unknown` and check it (Exercise 03).

## Common mistakes

- **`String`/`Number`/`Object` instead of `string`/`number`/`object`.**
- **Reaching for `any` when you mean `unknown`.** `any` disables checks *for everything it touches*.
- **Forgetting that `arr[0]` can be `undefined`.** Handle it (with `noUncheckedIndexedAccess` on, TS makes you).
- **Annotating everything.** Let inference work and annotate at the boundaries: parameters, exports and untyped data.
- **Using a long tuple where an object belongs.** `[string, number, boolean, string]` is unreadable. Name the fields.
- **Expecting a function that throws to be inferred as `never`.** Function *declarations* are inferred as returning `void`. Annotate `: never` yourself.

## Check your understanding

1. What's the type of `const level = "admin"`? What about `let level = "admin"`?
2. Why is `unknown` safer than `any` for the result of `JSON.parse`?
3. With `noUncheckedIndexedAccess`, what's the type of `prices[2]` if `prices: number[]`? What if `prices: [number, number, number]`?
4. Name two places where you should write a type annotation even though TypeScript could infer something.
5. Why can `value ?? fail("missing")` have type `string` when `value: string | undefined` and `fail` returns `never`?

<details>
<summary>Answers</summary>

1. `"admin"` (a literal type, because a `const` can never change) vs `string` (a `let` could be reassigned to any string).
2. `unknown` forces you to check the value (with `typeof`, etc.) before using it. `any` lets you call anything on it and crash at runtime.
3. `number | undefined` for the array (it might be shorter); `number` for the tuple (its length is fixed at 3).
4. Any two of: function parameters, return types of exported functions, empty arrays/objects that will be filled later, data you want checked against a named shape.
5. The result type is `string | never`, and `never` disappears from unions because it has no values. That leaves `string`.

</details>

## Handbook links

- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Tuple types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
- [The `unknown` and `never` types](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
- [Type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [`noUncheckedIndexedAccess`](https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess)
