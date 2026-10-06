import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type Catalog,
  type Category,
  type Product,
  addProduct,
  byCategory,
  cheapest,
  label,
} from "./starter";

const dune: Product = { id: "b1", name: "Dune", priceCents: 999, category: "books" };
const tetris: Product = { id: "g1", name: "Tetris", priceCents: 499, category: "games" };
const catalog: Catalog = { currency: "USD", products: [dune, tetris] };

describe("types", () => {
  test("shapes", () => {
    expectTypeOf<Category>().toEqualTypeOf<"books" | "games" | "music">();
    expectTypeOf<Product>().toEqualTypeOf<{
      id: string;
      name: string;
      priceCents: number;
      category: Category;
    }>();
    expectTypeOf<Catalog>().toEqualTypeOf<{ currency: string; products: Product[] }>();
  });

  test("unknown categories are rejected", () => {
    // @ts-expect-error - "movies" is not a Category
    const movie: Product = { id: "m1", name: "Alien", priceCents: 1299, category: "movies" };
    expect(movie).toBeDefined();
  });

  test("signatures", () => {
    expectTypeOf(addProduct).toEqualTypeOf<(catalog: Catalog, product: Product) => Catalog>();
    expectTypeOf(byCategory).toEqualTypeOf<(catalog: Catalog, category: Category) => Product[]>();
    expectTypeOf(cheapest).toEqualTypeOf<(catalog: Catalog) => Product | undefined>();
    expectTypeOf(label).parameter(0).toEqualTypeOf<{ name: string; priceCents: number }>();
  });
});

describe("addProduct", () => {
  test("appends without mutating", () => {
    const vinyl: Product = { id: "m1", name: "Blue", priceCents: 2499, category: "music" };
    const next = addProduct(catalog, vinyl);
    expect(next.products).toEqual([dune, tetris, vinyl]);
    expect(catalog.products).toHaveLength(2);
    expect(next).not.toBe(catalog);
  });

  test("rejects duplicate ids", () => {
    expect(() => addProduct(catalog, { ...dune, name: "Dune (reprint)" })).toThrow(/b1/);
  });
});

describe("queries", () => {
  test("byCategory", () => {
    expect(byCategory(catalog, "games")).toEqual([tetris]);
    expect(byCategory(catalog, "music")).toEqual([]);
  });

  test("cheapest", () => {
    expect(cheapest(catalog)).toBe(tetris);
    expect(cheapest({ currency: "USD", products: [] })).toBeUndefined();
  });

  test("label works with any object that has name and priceCents", () => {
    expect(label(dune, "USD")).toBe("Dune — 9.99 USD");
    const giftCard = { name: "Gift card", priceCents: 2500, code: "XYZ" };
    expect(label(giftCard, "EUR")).toBe("Gift card — 25.00 EUR");
  });
});
