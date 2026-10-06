// Labels (`x`, `y`) don't change the type. They show up in editor hovers
// and make destructuring self-documenting.
export type Point = [x: number, y: number];
export type PriceRange = [min: number, max: number];
// `readonly` removes push/pop/index assignment from the type.
export type RGB = readonly [r: number, g: number, b: number];

export function distance(a: Point, b: Point): number {
  // Tuple elements are always defined (fixed length), so no `undefined` checks.
  const [ax, ay] = a;
  const [bx, by] = b;
  return Math.hypot(bx - ax, by - ay);
}

export function midpoint(a: Point, b: Point): Point {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

export function priceRange(prices: number[]): PriceRange {
  // Math.min() of nothing is Infinity. Fail loudly instead of returning nonsense.
  if (prices.length === 0) throw new Error("Cannot get the range of an empty list");
  return [Math.min(...prices), Math.max(...prices)];
}

export function parseHexColor(hex: string): RGB {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Invalid hex color: ${hex}`);
  const channel = (start: number) => Number.parseInt(hex.slice(start, start + 2), 16);
  return [channel(1), channel(3), channel(5)];
}

export function pairUp(names: string[], prices: number[]): [string, number][] {
  const pairs: [string, number][] = [];
  const length = Math.min(names.length, prices.length);
  for (let i = 0; i < length; i++) {
    // With noUncheckedIndexedAccess these are `string | undefined` and
    // `number | undefined`. TS can't connect `i < length` to "defined".
    const name = names[i];
    const price = prices[i];
    if (name !== undefined && price !== undefined) pairs.push([name, price]);
  }
  return pairs;
}
