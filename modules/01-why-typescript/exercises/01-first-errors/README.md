# 01.01: Fix your first compile errors

**Type:** 🔧 Fix the type errors · **Time:** ~10 min

## Scenario

A teammate wrote a small greeting-card generator in a hurry. In plain JavaScript it would *look* fine until a customer hit the bug. TypeScript has already found **four mistakes**.

## Your task

1. Run `npm run exercise 01 01` and read each error. Your editor shows the same errors as red squiggles.
2. Fix each mistake in `starter.ts`. Every error points at a real bug, so the fix is never "add a type annotation to silence it".
3. Re-run until everything passes.

> 👀 You'll see **three** errors at first. Fixing one of them reveals the fourth. TypeScript reports one problem per object literal at a time, which is one more reason to fix errors from the top down and re-check.

## Rules

- Don't change the `Card` interface.
- No `any`, `as`, or `// @ts-ignore`.

## Acceptance criteria

- [ ] `starter.ts` has no type errors
- [ ] `createCard` returns a complete `Card` with the current year as a **number**
- [ ] `renderCard` produces the three-line message shown in the tests
- [ ] `cardCount` returns how many cards are in the list

<details>
<summary>Hint</summary>

Three of the four errors are typos that JavaScript would silently turn into `undefined` (or a crash). The fourth is a value of the wrong type. Hover over `getFullYear()` to see what it returns.

</details>
