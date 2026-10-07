// A tiny greeting-card generator.
// TypeScript has found 4 bugs in this file. Fix them all.

export interface Card {
  recipient: string;
  occasion: string;
  from: string;
  year: number;
}

export function createCard(recipient: string, occasion: string, from: string): Card {
  return {
    recipient: recipient,
    occasion: occasion,
    from: from,
    year: new Date().getFullYear(),
  };
}

export function renderCard(card: Card): string {
  return `Dear ${card.recipient.toUpperCase()},\nHappy ${card.occasion}!\nLove, ${card.from} (${card.year})`;
}

export function cardCount(cards: Card[]): number {
  return cards.length;
}
