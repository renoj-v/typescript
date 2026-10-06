// Library lending system. See README.md for the full spec.

// TODO: Book, Member, Loan, Library
export type Book = unknown;
export type Member = unknown;
export type Loan = unknown;
export type Library = unknown;

const DAY_MS = 24 * 60 * 60 * 1000;

export function createLibrary() {
  throw new Error("TODO: createLibrary");
}

export function addBook(library, book) {
  throw new Error("TODO: addBook");
}

export function addMember(library, member) {
  throw new Error("TODO: addMember");
}

export function availableCopies(library, isbn) {
  throw new Error("TODO: availableCopies");
}

export function activeLoans(library, memberId) {
  throw new Error("TODO: activeLoans");
}

export function checkout(library, isbn, memberId, today, loanDays = 14) {
  throw new Error(`TODO: checkout (loans last ${loanDays * DAY_MS}ms)`);
}

export function returnBook(library, isbn, memberId, today) {
  throw new Error("TODO: returnBook");
}

export function overdueLoans(library, today) {
  throw new Error("TODO: overdueLoans");
}

// --- Demo: runs only via `npm run exercise 04 project` ---
if (import.meta.main) {
  let library = createLibrary();
  library = addBook(library, { isbn: "978-0441013593", title: "Dune", author: "Frank Herbert", copies: 1 });
  library = addMember(library, { id: "m1", name: "Ada", maxLoans: 2 });
  library = checkout(library, "978-0441013593", "m1", new Date("2026-03-01"));
  console.log("Available copies of Dune:", availableCopies(library, "978-0441013593"));
  console.log("Overdue on April 1st:", overdueLoans(library, new Date("2026-04-01")));
}
