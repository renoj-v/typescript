// A tiny greeting-card generator: solved.

export interface Card {
  recipient: string;
  occasion: string;
  from: string;
  year: number;
}

export function createCard(recipient: string, occasion: string, from: string): Card {
  return {
    recipient: recipient,
    // Bug 1: `ocassion` was a typo. TypeScript checks object literals against
    // the declared return type (`Card`) and rejects unknown properties. In JS,
    // the card would have had `occasion: undefined`.
    occasion: occasion,
    from,
    // Bug 2: `getFullYear()` already returns a number. `.toString()` made it a
    // string, which doesn't match `year: number`.
    year: new Date().getFullYear(),
  };
}

export function renderCard(card: Card): string {
  // Bug 3: the method is `toUpperCase` (capital C). In JS this would throw
  // "toUppercase is not a function", but only when the code actually ran.
  return `Dear ${card.recipient.toUpperCase()},\nHappy ${card.occasion}!\nLove, ${card.from} (${card.year})`;
}

export function cardCount(cards: Card[]): number {
  // Bug 4: `lenght` → `length`. JS would return `undefined` without complaint.
  return cards.length;
}
