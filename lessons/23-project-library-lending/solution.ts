// Library lending system: reference solution.

export interface Book {
  readonly isbn: string;
  title: string;
  author: string;
  copies: number;
}

export interface Member {
  readonly id: string;
  name: string;
  maxLoans: number;
}

export interface Loan {
  readonly isbn: string;
  readonly memberId: string;
  readonly dueDate: Date;
  // Optional: missing means "still out". With exactOptionalPropertyTypes it
  // can't be explicitly `undefined`; it's either a Date or absent.
  returnedAt?: Date;
}

export interface Library {
  // `Readonly<Record<...>>` stops `library.books[isbn] = ...`, which forces
  // updates to go through copies.
  readonly books: Readonly<Record<string, Book>>;
  readonly members: Readonly<Record<string, Member>>;
  readonly loans: readonly Loan[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const isActive = (loan: Loan) => loan.returnedAt === undefined;

export function createLibrary(): Library {
  return { books: {}, members: {}, loans: [] };
}

export function addBook(library: Library, book: Book): Library {
  // `library.books[book.isbn]` is `Book | undefined`, so the lookup itself
  // tells us whether the ISBN is new.
  const existing = library.books[book.isbn];
  const stored = existing ? { ...existing, copies: existing.copies + book.copies } : { ...book };
  return { ...library, books: { ...library.books, [book.isbn]: stored } };
}

export function addMember(library: Library, member: Member): Library {
  if (library.members[member.id]) throw new Error(`Member id "${member.id}" is already taken`);
  return { ...library, members: { ...library.members, [member.id]: { ...member } } };
}

export function availableCopies(library: Library, isbn: string): number {
  const book = library.books[isbn];
  if (!book) return 0;
  const out = library.loans.filter((loan) => loan.isbn === isbn && isActive(loan)).length;
  return book.copies - out;
}

export function activeLoans(library: Library, memberId: string): Loan[] {
  return library.loans.filter((loan) => loan.memberId === memberId && isActive(loan));
}

export function checkout(
  library: Library,
  isbn: string,
  memberId: string,
  today: Date,
  loanDays = 14,
): Library {
  // Each check narrows away `undefined`, so after them `member` is a `Member`.
  if (!library.books[isbn]) throw new Error("Unknown book");
  const member = library.members[memberId];
  if (!member) throw new Error("Unknown member");
  if (availableCopies(library, isbn) <= 0) throw new Error("No copies available");
  if (activeLoans(library, memberId).length >= member.maxLoans) throw new Error("Loan limit reached");

  const loan: Loan = { isbn, memberId, dueDate: new Date(today.getTime() + loanDays * DAY_MS) };
  return { ...library, loans: [...library.loans, loan] };
}

export function returnBook(library: Library, isbn: string, memberId: string, today: Date): Library {
  const index = library.loans.findIndex(
    (loan) => loan.isbn === isbn && loan.memberId === memberId && isActive(loan),
  );
  if (index === -1) throw new Error("No active loan");

  // `with` (ES2023) returns a copy of the array with one element replaced.
  // It's made for readonly arrays.
  const loan = library.loans[index];
  if (!loan) throw new Error("No active loan");
  return { ...library, loans: library.loans.with(index, { ...loan, returnedAt: today }) };
}

export function overdueLoans(library: Library, today: Date): Loan[] {
  return library.loans.filter((loan) => isActive(loan) && loan.dueDate < today);
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
