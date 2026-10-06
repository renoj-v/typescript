// A union of string literals can only be named with `type`.
export type Category = "books" | "games" | "music";

// Object shapes: `interface` is a good default (it can be extended later,
// and its name shows up in error messages).
export interface Product {
  id: string;
  name: string;
  priceCents: number;
  category: Category;
}

export interface Catalog {
  currency: string;
  products: Product[];
}

export function addProduct(catalog: Catalog, product: Product): Catalog {
  if (catalog.products.some((p) => p.id === product.id)) {
    throw new Error(`A product with id "${product.id}" already exists`);
  }
  // New object + new array, so the caller's catalog is untouched.
  return { ...catalog, products: [...catalog.products, product] };
}

export function byCategory(catalog: Catalog, category: Category): Product[] {
  return catalog.products.filter((p) => p.category === category);
}

export function cheapest(catalog: Catalog): Product | undefined {
  // reduce without an initial value would throw on an empty array, so start
  // from `undefined` and say so in the accumulator's type.
  return catalog.products.reduce<Product | undefined>(
    (best, p) => (best === undefined || p.priceCents < best.priceCents ? p : best),
    undefined,
  );
}

// An inline object type that asks only for what the function uses.
// Structural typing means any object with these fields fits, including Product.
export function label(item: { name: string; priceCents: number }, currency: string): string {
  return `${item.name} — ${(item.priceCents / 100).toFixed(2)} ${currency}`;
}
