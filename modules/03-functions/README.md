# Module 03: Functions

> ⏱ ~10 min read · Then: 5 exercises + a mini-project

## Parameter and return types

```ts
function lineTotal(price: number, quantity: number): number {
  return price * quantity;
}

const formatPrice = (amount: number): string => `$${amount.toFixed(2)}`;
```

- **Parameters always need types**, unless the function is a callback whose type is already known (see *contextual typing* below).
- **Return types are optional** because TypeScript infers them. Annotate exported functions anyway: a mistake inside the function is then reported *there*, not at some distant call site.

## Optional and default parameters

```ts
function greet(name: string, greeting?: string): string {
  // greeting: string | undefined
  return `${greeting ?? "Hello"}, ${name}!`;
}

function applyTax(amount: number, rate = 0.2): number {
  // rate: number. The default removes `undefined` inside the function.
  return amount * (1 + rate);
}

greet("Ada");          // ✅
applyTax(100, 0.1);    // ✅
applyTax(100, "10%");  // ❌ the default's type (number) is the parameter's type
```

Optional parameters must come **after** required ones. Prefer a default value over `?` when there's a sensible default.

## Rest parameters

```ts
function sum(...amounts: number[]): number {
  return amounts.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3);

const prices = [4, 5];
sum(...prices); // ✅ spreading an array into a rest parameter
```

## Function types

Functions are values, so they have types:

```ts
type PriceFormatter = (amount: number) => string;

const usd: PriceFormatter = (amount) => `$${amount.toFixed(2)}`; // `amount` inferred as number

function formatAll(amounts: number[], format: PriceFormatter): string[] {
  return amounts.map(format);
}
```

Parameter **names** in a function type are just labels. Only their types and positions matter.

### Contextual typing

When TypeScript already knows the expected function type, it fills in the callback's parameter types for you:

```ts
["a", "b"].map((letter, index) => letter.repeat(index)); // letter: string, index: number
button.addEventListener("click", (event) => event.clientX); // event: MouseEvent
```

Annotating these is redundant. Let the context do the work.

## `void`

`void` means "this function's return value isn't meant to be used".

```ts
function logSale(amount: number): void {
  console.log(`Sold $${amount}`);
}
```

A **callback type** returning `void` accepts functions that *do* return something. The value is simply ignored:

```ts
type OnItem = (item: string) => void;

const seen: string[] = [];
const track: OnItem = (item) => seen.push(item); // ✅ push returns a number; that's fine
```

That's why `["x"].forEach((x) => seen.push(x))` works. `undefined` is stricter: a function type returning `undefined` really must return `undefined`.

## Overloads

Sometimes the return type depends on which arguments you pass. **Overload signatures** list the allowed call shapes, and one **implementation** handles them all:

```ts
function toCents(amount: number): number;
function toCents(amounts: number[]): number[];
function toCents(input: number | number[]): number | number[] {
  return Array.isArray(input) ? input.map((n) => Math.round(n * 100)) : Math.round(input * 100);
}

const one = toCents(4.99);       // number
const many = toCents([1, 2.5]);  // number[]
```

- Callers only see the overload signatures, not the implementation signature.
- The implementation must be compatible with every overload.
- **Prefer a union or an optional parameter** when the return type doesn't change. Use overloads only when the output type depends on the input.

## ⚠️ Types disappear at runtime

`function charge(amount: number)` doesn't stop JavaScript callers, or JSON data, from passing `"10"`. Inside your own TypeScript code the types protect you. At the edges (form inputs, API data, or a library that plain JS calls), validate.

## Common mistakes

- **Using `Function` as a type.** It accepts anything callable and checks nothing. Write the actual signature: `(id: string) => void`.
- **Putting optional parameters first.** `(a?: string, b: number)` is an error. Reorder, or pass an options object.
- **Writing `?:` *and* a default.** `rate?: number = 0.2` is an error. The default already makes it optional.
- **Typing a callback as returning `undefined` when you mean `void`.** Then arrow functions like `(x) => list.push(x)` fail.
- **Expecting overloads to check the implementation for you.** The implementation signature is wider, so test every overload.
- **Annotating callback parameters that context already types**, e.g. `.map((item: CartItem) => ...)`.

## Check your understanding

1. What's the type of `rate` inside `function f(rate = 5) {}`? What can callers pass?
2. Why does `const cb: () => void = () => 42;` compile?
3. When should you reach for overloads instead of a union parameter?
4. What does `type Handler = (event: string) => void` describe?
5. Why shouldn't you use the `Function` type?

<details>
<summary>Answers</summary>

1. `number`. Callers can pass a `number` or `undefined`, or leave it out.
2. A `void` return in a function *type* means "the caller ignores the result", so a function returning a value is still assignable.
3. When the **return type depends on the argument types**, e.g. a number in, a number out; an array in, an array out.
4. A function that takes one `string` argument and whose return value isn't used.
5. It accepts any function and lets you call it with any arguments, returning `any`, so it loses all type safety.

</details>

## Handbook links

- [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [Function overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)
- [Return type `void`](https://www.typescriptlang.org/docs/handbook/2/functions.html#return-type-void)
- [Rest parameters and arguments](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments)
