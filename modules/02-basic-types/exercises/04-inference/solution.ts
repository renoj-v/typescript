export interface Book {
  title: string;
  genre: string;
  price: number;
}

// This annotation earns its place: it checks every object against `Book`,
// and it gives the array a meaningful name in hovers and error messages.
export const books: Book[] = [
  { title: "Dune", genre: "sci-fi", price: 9.99 },
  { title: "The Hobbit", genre: "fantasy", price: 8.5 },
  { title: "Neuromancer", genre: "sci-fi", price: 14.99 },
];

// ---- Part A ----

// `book` is contextually typed from `books`, and `map` infers `number[]`.
export const prices = books.map((book) => book.price);

// `reduce` infers `sum` from the initial value `0`, and `price` from `prices`.
export const totalValue = prices.reduce((sum, price) => sum + price, 0);

export function countByGenre(genre: string): number {
  // `let` + a number literal → `number`. ESLint's no-inferrable-types flags
  // the annotated version.
  let count = 0;
  for (const book of books) {
    if (book.genre === genre) count++;
  }
  return count;
}

// ---- Part B ----

// Parameters are the one place TypeScript can't infer from usage.
export function discountedPrice(price: number, percent: number): number {
  return Math.round(price * (100 - percent)) / 100;
}

// An empty `{}` gives TypeScript nothing to infer from. Say what it will hold.
export function totalsByGenre(): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const book of books) {
    // `totals[book.genre]` is `number | undefined` (noUncheckedIndexedAccess),
    // which is exactly why `?? 0` is needed.
    totals[book.genre] = (totals[book.genre] ?? 0) + book.price;
  }
  return totals;
}

// The return annotation turned a silent mistake (sometimes a string) into a
// compile error *inside* the function, where it's easy to fix.
export function shippingFor(orderTotal: number): number {
  if (orderTotal >= 50) return 0;
  return 4.99;
}
