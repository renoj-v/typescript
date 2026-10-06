# 04.05: Add types to a JavaScript address book

**Type:** 🏷️ Add types to existing JS · **Time:** ~25 min

## Scenario

You've inherited an address-book module from a JavaScript codebase. The code works. Your job is to describe its data precisely, so that the next person can't misuse it.

## Your task

Write these types, then annotate every function:

| Type | Fields |
|---|---|
| `Address` | `street: string`, `city: string`, `postcode?: string` (optional), `country: string` |
| `NewContact` | `name: string`, `email?: string`, `phone?: string`, `address?: Address`, `tags: string[]` |
| `Contact` | Everything in `NewContact`, **plus** `readonly id: number`. Use `extends`. |
| `ContactChanges` | The same fields as `NewContact`, but **all optional**, and with **no `id`**, so an update can't change it |
| `AddressBook` | `readonly contacts: readonly Contact[]`, `readonly nextId: number` |

Then type the functions in `starter.ts`. Don't change their behavior.

## Acceptance criteria

- [ ] All types match the table (checked by type tests)
- [ ] `updateContact(book, 1, { id: 99 })` is a compile error
- [ ] `book.contacts.push(...)` is a compile error
- [ ] `formatAddress` handles a missing postcode
- [ ] No `any`; all tests pass

> 💡 Writing `ContactChanges` by hand repeats `NewContact`. In Module 08 you'll replace it with `Partial<NewContact>`.
