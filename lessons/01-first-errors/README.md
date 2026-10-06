# Part 1: Why TypeScript & setup

> Lessons 01–05 · ⏱ ~10 min read, then this lesson's exercise below

## What TypeScript actually is

TypeScript is **JavaScript plus a type checker**. You write `.ts` files with type annotations, and the compiler does two separate jobs:

1. **Type-checks** your code and reports mistakes *before* it runs.
2. **Erases** the types to produce plain JavaScript that Node or the browser can run.

```ts
// cart.ts
function lineTotal(price: number, quantity: number): number {
  return price * quantity;
}

lineTotal(9.99, "2");
//              ~~~ Argument of type 'string' is not assignable to parameter of type 'number'.
```

In plain JavaScript, `9.99 * "2"` quietly gives `19.98`. But `9.99 + "2"` gives `"9.992"`. TypeScript catches the *category* of bug before any customer sees a wrong total.

### ⚠️ Types disappear at runtime

This is the most important idea in the course. After compiling, the code above becomes:

```js
function lineTotal(price, quantity) {
  return price * quantity;
}
```

No types are left. So:

- TypeScript **cannot** check data that arrives while the program runs: `JSON.parse`, `fetch`, form inputs, `localStorage`.
- Writing `as User` doesn't convert or validate anything. It's you telling the compiler "trust me".
- You can't use a type at runtime. For example, `if (x instanceof User)` only works when `User` is a class, not an `interface` or `type`.

```ts
interface User { name: string; age: number }

const user = JSON.parse('{"name": "Ada"}') as User; // compiles fine...
user.age.toFixed(0); // 💥 runtime TypeError: Cannot read properties of undefined
```

That's why you check untrusted data at runtime (you'll do it by hand in Lesson 03, and with Zod in Part 12).

## The compiler: `tsc`

`tsc` is the TypeScript compiler. In this course it only **checks**, with `noEmit: true`. Tools like `tsx`, Vite and Vitest strip the types themselves and run the result, which is much faster.

```bash
npx tsc --noEmit          # check the whole project, using tsconfig.json
npm run typecheck         # same thing, via this repo's script
npm run typecheck -- 3    # just lesson 03
```

> TypeScript runs your code **even when it has type errors**. `tsx` and Vite strip types without checking them. Type errors are warnings from the checker, not a build blocker, unless your tooling makes them one. This repo makes them one: the tests fail on type errors.

## `tsconfig.json` basics

`tsconfig.json` tells `tsc` which files to check and how strict to be. This repo's settings live in [`tsconfig.base.json`](../tsconfig.base.json). The ones that matter now:

| Option | What it does |
|---|---|
| `"strict": true` | Turns on the full family of safety checks. Always use it in new projects. |
| `"target": "ES2023"` | Which JavaScript version the output (and available syntax) targets. |
| `"lib": ["ES2023", "DOM"]` | Which built-in APIs exist (e.g. `Array.prototype.at`, `document`). |
| `"noEmit": true` | Only type-check; never write `.js` files. |
| `"include"` / `"exclude"` | Which files belong to the project. |

Part 14 covers the rest in depth.

## Reading error messages

TypeScript errors look scary but follow a pattern:

```
starter.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
└─ file:line:col         └─ code  └─ what went wrong
```

- **Read the first line first.** It's the summary. Indented lines below it explain *why*, going deeper into nested types. The **last** indented line is often the most specific clue.
- **"X is not assignable to Y"** means you gave X, but Y was expected. Figure out which side is the mistake. Sometimes the annotation is wrong, not the value.
- **The error code is searchable.** `TS2322`, `TS2345` and `TS7006` will become old friends.
- **Fix the first error first.** One mistake can cause several follow-on errors.

| Code | Plain English |
|---|---|
| TS2322 | You assigned a value of the wrong type. |
| TS2345 | You passed an argument of the wrong type to a function. |
| TS2339 | That property doesn't exist on this type (often a typo). |
| TS2554 | Wrong number of arguments. |
| TS7006 | A parameter has no type, so it's implicitly `any`. Add an annotation. |
| TS18048 | This value might be `undefined`. Handle that case first. |

## Editor tooling

Your editor runs the same type checker as you type. Learn these early:

- **Hover** over any variable to see its inferred type. This is the #1 learning tool.
- **Go to Definition** (F12): jump to where a type or function is declared, including inside `node_modules`.
- **Quick Fix** (Ctrl/Cmd + .): add missing imports, fix spelling, implement interfaces.
- **Rename Symbol** (F2): renames everywhere, safely.
- **Use the workspace TypeScript version.** This repo's [`.vscode/settings.json`](../.vscode/settings.json) points VS Code at the pinned version in `node_modules`.

## How the lessons work

Every lesson is one folder in `lessons/` with a task (`README.md`), a `starter.ts` you edit, its tests, and a `solution.ts`.

```bash
npm run lesson 1              # run lessons/01-*/starter.ts, then its tests
npm run lesson 1 -- --watch   # re-run the tests on every save
```

Each lesson's tests check **runtime behavior** (`expect(...)`) and **types** (`expectTypeOf(...)` and `// @ts-expect-error`). A type error in your starter file also fails the run. You're done when everything is green, with no `any` and no `// @ts-ignore`.

## Common mistakes

- **Thinking types are checked at runtime.** They aren't. `as SomeType` on parsed JSON proves nothing.
- **Silencing errors with `any` or `// @ts-ignore`.** The error was usually right. Read it first.
- **Fixing the 10th error before the 1st.** Later errors are often caused by earlier ones.
- **Using the editor's bundled TypeScript.** It can differ from the project's version, so your editor and `tsc` disagree.
- **Turning off `strict` to make errors go away.** You lose most of what TypeScript offers.

## Check your understanding

1. You run a `.ts` file with type errors using `tsx`. What happens?
2. What JavaScript does `const total: number = 5;` compile to?
3. Why doesn't `JSON.parse(text) as Product` guarantee you have a `Product`?
4. What does `"strict": true` do, in one sentence?
5. An error says `Type 'string' is not assignable to type 'number'`. Which is "the value you gave" and which is "what was expected"?

<details>
<summary>Answers</summary>

1. It runs anyway. `tsx` strips types without checking them. Use `tsc --noEmit`, or this repo's tests, to see the errors.
2. `const total = 5;`. The annotation is erased.
3. `as` is a compile-time assertion only. No code runs to check the shape, so the object could be missing fields or have wrong types.
4. It enables a family of stricter checks (`noImplicitAny`, `strictNullChecks` and more) that catch far more bugs.
5. `string` is the type of the value you provided. `number` is the type that was expected.

</details>

## Handbook links

- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [TSConfig reference](https://www.typescriptlang.org/tsconfig/)

---

# Lesson 01: Fix your first compile errors

**Type:** 🔧 Fix the type errors · **Time:** ~10 min

## Scenario

A teammate wrote a small greeting-card generator in a hurry. In plain JavaScript it would *look* fine until a customer hit the bug. TypeScript has already found **four mistakes**.

## Your task

1. Run `npm run lesson 1` and read each error. Your editor shows the same errors as red squiggles.
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
