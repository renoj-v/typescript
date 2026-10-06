# TypeScript, hands-on

A self-paced TypeScript course for people who already know modern JavaScript. It's a numbered list of hands-on lessons, grouped into topics ("parts"). In each one you solve an exercise yourself, with tests that tell you right away whether your **code** *and* your **types** are correct. The course ends with a bridge into React + TypeScript.

## Setup

Requires **Node.js 24+** (see [`.nvmrc`](.nvmrc)).

```bash
npm install
```

In VS Code, accept the prompt to **use the workspace TypeScript version**, and install the recommended extensions (ESLint, Vitest, Pretty TS Errors).

**Pinned stack:**
- TypeScript 6.0.3 (`strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`)
- Vitest 5, tsx, ESLint 10 with typescript-eslint 8 (strict, type-aware)
- Vite 8

> **Why TypeScript 6.0 and not 7?** TypeScript 7 (the native Go compiler) checks types the same way, but typescript-eslint doesn't support it yet. Switching later only means changing the version number.

## How to use this repo

Work through `lessons/` in order: `01`, `02`, `03` and so on.

1. Read the lesson's `README.md`. The first lesson of each part opens with that part's reading (about 10 minutes), followed by the task.
2. Edit **`starter.ts`** until its tests pass:

   ```bash
   npm run lesson 7              # run lessons/07-*/starter.ts, then its tests
   npm run lesson 7 -- --watch   # re-run the tests whenever you save
   ```

3. Compare with **`solution.ts`**. It explains *why* in comments. Try not to peek until you're green, or properly stuck.
4. Tick the box in [`PROGRESS.md`](PROGRESS.md).

### What "passing" means

Every lesson's `*.test.ts` checks two things:

- **Runtime behavior:** `expect(fn(input)).toBe(output)`
- **Types:** `expectTypeOf(fn).returns.toEqualTypeOf<...>()`, plus `// @ts-expect-error` lines that must *stay* errors. These catch types that are too loose, like `any`.

A type error anywhere in your `starter.ts` also fails the run. Code that runs but has the wrong types doesn't count as done.

### All scripts

| Command | What it does |
|---|---|
| `npm run lesson 7` | Run one lesson's starter, then its tests |
| `npm test` | Run every test in the course |
| `npm test -- lessons/07` | Run one lesson's tests |
| `npm run test:watch -- lessons/07` | Same, in watch mode |
| `npm run typecheck` | `tsc --noEmit` across the course (solutions excluded) |
| `npm run typecheck -- 7` | Type-check just one lesson |
| `npm run play` | Run [`playground/index.ts`](playground/index.ts) in watch mode |
| `npm run lint` | ESLint with typescript-eslint's strict rules (`npm run lint -- lessons/07` for one lesson) |
| `npm run verify` | Maintainer check: every solution passes and every starter fails (`-- 7` for one lesson) |

> Until you've solved everything, `npm test` and `npm run typecheck` **will report errors**. Those are the lessons waiting for you. Work one lesson at a time with `npm run lesson`.

## Course map

| Part | Topic | Lessons | Status |
|---|---|---|---|
| 1 | [Why TypeScript & setup](lessons/01-first-errors/) | 01–05 | ✅ |
| 2 | [Basic types](lessons/06-user-profile/) | 06–11 | ✅ |
| 3 | [Functions](lessons/12-cart-total/) | 12–17 | ✅ |
| 4 | [Object types](lessons/18-product-catalog/) | 18–23 | ✅ |
| 5 | Unions & narrowing | | 🚧 next batch |
| 6 | Literal types & enum alternatives | | 🚧 |
| 7 | Generics | | 🚧 |
| 8 | Built-in utility types | | 🚧 |
| 9 | Type operators | | 🚧 |
| 10 | Classes & OOP | | 🚧 |
| 11 | Modules & declaration files | | 🚧 |
| 12 | Async & real-world data (Zod) | | 🚧 |
| 13 | TypeScript in the browser (Vite) | | 🚧 |
| 14 | Configuration & tooling | | 🚧 |
| 15 | Bridge to React | | 🚧 |
| 16 | [Capstone](final-project/) | | 🚧 |

Lesson types are marked in each README: ✍️ **write the code**, 🔧 **fix the type errors**, 🏷️ **add types to existing JS**.

## Repo layout

```
lessons/
  01-first-errors/
    README.md             the task + acceptance criteria (a part's first lesson starts with its reading)
    starter.ts            ← you edit this
    solution.ts           reference solution with "why" comments
    *.test.ts             runtime + type tests
  02-reading-errors/
  …
  05-project-receipt-printer/   each part ends with a mini-project
playground/               scratch space with the course tsconfig
final-project/            capstone spec
scripts/                  the npm script helpers
```

## The one idea to keep in mind

**Types disappear at runtime.** TypeScript checks your code *before* it runs, then erases every annotation. Data that arrives while the program runs (JSON, `fetch`, form inputs, `localStorage`) has never been checked by anyone. Every part points out where this matters, and Part 12 shows how to validate untrusted data properly.
