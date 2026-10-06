# Lesson 07: Tuples for coordinates, ranges and colors

**Type:** ✍️ Write the code · **Time:** ~20 min

## Scenario

A store-locator feature needs to work with map coordinates, find price ranges and parse brand colors. Each of these is short, positional data, which makes them a good fit for tuples.

## Your task

1. Define the tuple types:
   - `Point`: exactly two numbers, labeled `x` and `y`
   - `PriceRange`: exactly two numbers, labeled `min` and `max`
   - `RGB`: a **readonly** tuple of three numbers, labeled `r`, `g` and `b`
2. Implement the functions, with typed parameters and return types:
   - `distance(a: Point, b: Point): number`: straight-line distance (use `Math.hypot`)
   - `midpoint(a, b): Point`: the point halfway between them
   - `priceRange(prices: number[]): PriceRange`: the lowest and highest price. **Throw** an `Error` if `prices` is empty.
   - `parseHexColor(hex: string): RGB`: `"#ff8800"` → `[255, 136, 0]`. Throw if the input isn't `#` followed by 6 hex digits.
   - `pairUp(names: string[], prices: number[]): [string, number][]`: zips two lists into pairs, stopping at the shorter one.

## Acceptance criteria

- [ ] A `Point` can't be built with 3 numbers (there's a `@ts-expect-error` test for this)
- [ ] An `RGB` can't be modified after it's created
- [ ] All tests pass and there are no type errors

<details>
<summary>Hint: labeled and readonly tuples</summary>

```ts
type Size = [width: number, height: number];
type Frozen = readonly [a: string, b: string];
```

</details>

<details>
<summary>Hint: parsing hex</summary>

`Number.parseInt("ff", 16)` → `255`. `/^#[0-9a-f]{6}$/i.test(hex)` checks the format. With `noUncheckedIndexedAccess`, `names[i]` is `string | undefined`, so check it, or loop up to the shorter length and handle `undefined`.

</details>
