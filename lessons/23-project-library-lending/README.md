# Lesson 23 (project): Library lending system

**Time:** ~60–90 min · **Uses:** interfaces, `extends`, optional and `readonly` properties, `Record`, immutable updates

## The spec

Model a small community library: books, members and loans. Every operation returns a **new** `Library`; nothing is mutated.

### Types

```ts
interface Book    { readonly isbn: string; title: string; author: string; copies: number }
interface Member  { readonly id: string; name: string; maxLoans: number }
interface Loan    { readonly isbn: string; readonly memberId: string; readonly dueDate: Date; returnedAt?: Date }
interface Library {
  readonly books: Readonly<Record<string, Book>>;     // keyed by ISBN
  readonly members: Readonly<Record<string, Member>>; // keyed by member id
  readonly loans: readonly Loan[];
}
```

A loan is **active** while it has no `returnedAt`.

### Functions

| Function | Behavior |
|---|---|
| `createLibrary(): Library` | Empty books, members and loans |
| `addBook(library, book)` | Adds the book. If the ISBN already exists, **adds its copies** to the existing entry. |
| `addMember(library, member)` | Adds the member. Throws if the id is taken. |
| `availableCopies(library, isbn): number` | `copies` minus active loans of that ISBN. `0` for unknown books. |
| `activeLoans(library, memberId): Loan[]` | That member's active loans |
| `checkout(library, isbn, memberId, today: Date, loanDays = 14)` | Creates a loan due `loanDays` after `today`. Throws `"Unknown book"`, `"Unknown member"`, `"No copies available"` or `"Loan limit reached"` (checked in that order). |
| `returnBook(library, isbn, memberId, today: Date)` | Sets `returnedAt` on that member's active loan for that ISBN. Throws `"No active loan"` if there isn't one. |
| `overdueLoans(library, today: Date): Loan[]` | Active loans whose `dueDate` is before `today` |

Every function except `availableCopies`, `activeLoans` and `overdueLoans` returns a `Library`.

## Run it

```bash
npm run lesson 23
```

## Acceptance criteria

- [ ] Types match the spec exactly, including `readonly` and the optional `returnedAt`
- [ ] No function mutates the library it's given (the tests check this)
- [ ] Errors use the exact messages above
- [ ] All tests pass, with no `any`

## Stretch goals (untested)

1. **Fines:** `fineFor(loan, today)`, 25¢ per day overdue, capped at $5.
2. **Holds:** let members reserve a book with no copies available. When it's returned, the next member in the queue gets it.
3. **Persistence:** `toJSON(library)` / `fromJSON(text)`. `Date`s become strings in JSON. How will you validate and convert them back? (Part 12 makes this easy with Zod.)
