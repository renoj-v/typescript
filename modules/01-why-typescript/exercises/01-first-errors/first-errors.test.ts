import { describe, expect, expectTypeOf, test } from "vitest";
import { type Card, cardCount, createCard, renderCard } from "./starter";

const year = new Date().getFullYear();

describe("createCard", () => {
  test("builds a complete card", () => {
    expect(createCard("Grace", "birthday", "Ada")).toEqual({
      recipient: "Grace",
      occasion: "birthday",
      from: "Ada",
      year,
    });
  });

  test("year is a number", () => {
    expect(typeof createCard("Grace", "birthday", "Ada").year).toBe("number");
    expectTypeOf(createCard).returns.toEqualTypeOf<Card>();
  });
});

describe("renderCard", () => {
  test("renders a three-line message", () => {
    const card: Card = { recipient: "Grace", occasion: "birthday", from: "Ada", year: 2026 };
    expect(renderCard(card)).toBe("Dear GRACE,\nHappy birthday!\nLove, Ada (2026)");
  });
});

describe("cardCount", () => {
  test("counts cards", () => {
    const card = createCard("Grace", "birthday", "Ada");
    expect(cardCount([])).toBe(0);
    expect(cardCount([card, card, card])).toBe(3);
  });
});
