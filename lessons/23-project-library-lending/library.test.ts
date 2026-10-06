import { beforeEach, describe, expect, expectTypeOf, test } from "vitest";
import {
  type Book,
  type Library,
  type Loan,
  type Member,
  activeLoans,
  addBook,
  addMember,
  availableCopies,
  checkout,
  createLibrary,
  overdueLoans,
  returnBook,
} from "./starter";

const dune: Book = { isbn: "dune", title: "Dune", author: "Frank Herbert", copies: 2 };
const hobbit: Book = { isbn: "hobbit", title: "The Hobbit", author: "J.R.R. Tolkien", copies: 1 };
const ada: Member = { id: "ada", name: "Ada", maxLoans: 2 };
const grace: Member = { id: "grace", name: "Grace", maxLoans: 1 };
const march1 = new Date("2026-03-01T00:00:00Z");
const march15 = new Date("2026-03-15T00:00:00Z");
const april1 = new Date("2026-04-01T00:00:00Z");

let library: Library;
beforeEach(() => {
  library = [dune, hobbit].reduce(addBook, createLibrary());
  library = [ada, grace].reduce(addMember, library);
});

describe("types", () => {
  test("shapes", () => {
    expectTypeOf<Book>().toEqualTypeOf<{ readonly isbn: string; title: string; author: string; copies: number }>();
    expectTypeOf<Member>().toEqualTypeOf<{ readonly id: string; name: string; maxLoans: number }>();
    expectTypeOf<Loan>().toEqualTypeOf<{
      readonly isbn: string;
      readonly memberId: string;
      readonly dueDate: Date;
      returnedAt?: Date;
    }>();
    expectTypeOf<Library>().toEqualTypeOf<{
      readonly books: Readonly<Record<string, Book>>;
      readonly members: Readonly<Record<string, Member>>;
      readonly loans: readonly Loan[];
    }>();
  });

  test("signatures", () => {
    expectTypeOf(createLibrary).toEqualTypeOf<() => Library>();
    expectTypeOf(addBook).toEqualTypeOf<(library: Library, book: Book) => Library>();
    expectTypeOf(addMember).toEqualTypeOf<(library: Library, member: Member) => Library>();
    expectTypeOf(availableCopies).toEqualTypeOf<(library: Library, isbn: string) => number>();
    expectTypeOf(activeLoans).toEqualTypeOf<(library: Library, memberId: string) => Loan[]>();
    expectTypeOf(checkout).toBeCallableWith(library, "dune", "ada", march1);
    expectTypeOf(checkout).toBeCallableWith(library, "dune", "ada", march1, 7);
    expectTypeOf(checkout).returns.toEqualTypeOf<Library>();
    expectTypeOf(returnBook).toEqualTypeOf<
      (library: Library, isbn: string, memberId: string, today: Date) => Library
    >();
    expectTypeOf(overdueLoans).toEqualTypeOf<(library: Library, today: Date) => Loan[]>();
  });

  test("a library can't be mutated directly", () => {
    // @ts-expect-error - books is readonly
    library.books.dune = hobbit;
    // @ts-expect-error - loans is a readonly array
    library.loans.push({ isbn: "dune", memberId: "ada", dueDate: march1 });
  });
});

describe("books and members", () => {
  test("adding an existing ISBN adds copies", () => {
    const more = addBook(library, { ...dune, copies: 3 });
    expect(more.books.dune?.copies).toBe(5);
    expect(library.books.dune?.copies).toBe(2);
  });

  test("duplicate member ids throw", () => {
    expect(() => addMember(library, { ...ada, name: "Other Ada" })).toThrow();
  });
});

describe("loans", () => {
  test("checkout creates a loan due in 14 days", () => {
    const next = checkout(library, "dune", "ada", march1);
    expect(next.loans).toEqual([{ isbn: "dune", memberId: "ada", dueDate: march15 }]);
    expect(availableCopies(next, "dune")).toBe(1);
    expect(availableCopies(library, "dune")).toBe(2);
    expect(library.loans).toHaveLength(0);
  });

  test("custom loan length", () => {
    const next = checkout(library, "dune", "ada", march1, 31);
    expect(next.loans[0]?.dueDate).toEqual(april1);
  });

  test("checkout errors, in order", () => {
    expect(() => checkout(library, "nope", "nobody", march1)).toThrow("Unknown book");
    expect(() => checkout(library, "dune", "nobody", march1)).toThrow("Unknown member");
    const out = checkout(library, "hobbit", "ada", march1);
    expect(() => checkout(out, "hobbit", "grace", march1)).toThrow("No copies available");
    const atLimit = checkout(library, "dune", "grace", march1);
    expect(() => checkout(atLimit, "hobbit", "grace", march1)).toThrow("Loan limit reached");
  });

  test("returnBook frees the copy", () => {
    const out = checkout(library, "hobbit", "ada", march1);
    const back = returnBook(out, "hobbit", "ada", march15);
    expect(back.loans[0]?.returnedAt).toEqual(march15);
    expect(availableCopies(back, "hobbit")).toBe(1);
    expect(activeLoans(back, "ada")).toEqual([]);
    expect(out.loans[0]?.returnedAt).toBeUndefined();
  });

  test("returnBook without a loan throws", () => {
    expect(() => returnBook(library, "dune", "ada", march1)).toThrow("No active loan");
  });

  test("overdueLoans", () => {
    let next = checkout(library, "dune", "ada", march1);
    next = checkout(next, "hobbit", "grace", march1, 60);
    expect(overdueLoans(next, march15)).toEqual([]);
    expect(overdueLoans(next, april1).map((loan) => loan.memberId)).toEqual(["ada"]);
    expect(overdueLoans(returnBook(next, "dune", "ada", march15), april1)).toEqual([]);
  });

  test("availableCopies of an unknown book is 0", () => {
    expect(availableCopies(library, "nope")).toBe(0);
  });
});
