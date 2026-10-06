export interface Book {
  title: string;
  genre: string;
  price: number;
}

// ✅ Keep this annotation: it checks the data against `Book`.
export const books: Book[] = [
  { title: "Dune", genre: "sci-fi", price: 9.99 },
  { title: "The Hobbit", genre: "fantasy", price: 8.5 },
  { title: "Neuromancer", genre: "sci-fi", price: 14.99 },
];

// ---- Part A: remove the redundant annotations ----

export const prices: number[] = books.map((book: Book): number => book.price);

export const totalValue: number = prices.reduce((sum: number, price: number): number => sum + price, 0);

export function countByGenre(genre: string): number {
  let count: number = 0;
  for (const book of books) {
    if (book.genre === genre) count++;
  }
  return count;
}

// ---- Part B: add the annotations that are missing ----

export function discountedPrice(price, percent) {
  return Math.round(price * (100 - percent)) / 100;
}

export function totalsByGenre() {
  const totals = {};
  for (const book of books) {
    totals[book.genre] = (totals[book.genre] ?? 0) + book.price;
  }
  return totals;
}

export function shippingFor(orderTotal: number) {
  if (orderTotal >= 50) return 0;
  return "4.99";
}
