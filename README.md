# TypeScript, hands-on

A self-paced TypeScript course for people who already know modern JavaScript. Each module is a short lesson, then exercises you solve yourself, with tests that tell you right away whether your **code** *and* your **types** are correct. The course ends with a bridge into React + TypeScript.

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

1. Read a module's `README.md` (about 10 minutes).
2. Work through its `exercises/` in order. Each has a `README.md` with the task and acceptance criteria.
3. Edit **`starter.ts`** until its tests pass:

   ```bash
   npm run exercise 01 02             # run exercises/02-*/starter.ts, then its tests
   npm run exercise 01 02 -- --watch  # re-run the tests whenever you save
   npm run exercise 01 project        # the module's mini-project
   ```

4. Compare with **`solution.ts`**. It explains *why* in comments. Try not to peek until you're green, or properly stuck.
5. Tick the box in [`PROGRESS.md`](PROGRESS.md).

### What "passing" means

Every exercise's `*.test.ts` checks two things:

- **Runtime behavior:** `expect(fn(input)).toBe(output)`
- **Types:** `expectTypeOf(fn).returns.toEqualTypeOf<...>()`, plus `// @ts-expect-error` lines that must *stay* errors. These catch types that are too loose, like `any`.

A type error anywhere in your `starter.ts` also fails the run. Code that runs but has the wrong types doesn't count as done.

### All scripts

| Command | What it does |
|---|---|
| `npm run exercise 05 02` | Run one exercise's starter, then its tests |
| `npm test` | Run every test in the course |
| `npm test -- modules/05` | Run one module's tests |
| `npm run test:watch -- modules/05` | Same, in watch mode |
| `npm run typecheck` | `tsc --noEmit` across the course (solutions excluded) |
| `npm run typecheck -- 05 02` | Type-check just one exercise (or `05` for a module, `05 project`) |
| `npm run play` | Run [`playground/index.ts`](playground/index.ts) in watch mode |
| `npm run lint` | ESLint with typescript-eslint's strict rules (`npm run lint -- modules/05` for one module) |
| `npm run verify` | Maintainer check: every solution passes and every starter fails |

> Until you've solved everything, `npm test` and `npm run typecheck` **will report errors**. Those are the exercises waiting for you. Work one exercise at a time with `npm run exercise`.

## Course map

| # | Module | Status |
|---|---|---|
| 01 | [Why TypeScript & setup](modules/01-why-typescript/) | ✅ |
| 02 | [Basic types](modules/02-basic-types/) | ✅ |
| 03 | [Functions](modules/03-functions/) | ✅ |
| 04 | [Object types](modules/04-object-types/) | ✅ |
| 05 | Unions & narrowing | 🚧 next batch |
| 06 | Literal types & enum alternatives | 🚧 |
| 07 | Generics | 🚧 |
| 08 | Built-in utility types | 🚧 |
| 09 | Type operators | 🚧 |
| 10 | Classes & OOP | 🚧 |
| 11 | Modules & declaration files | 🚧 |
| 12 | Async & real-world data (Zod) | 🚧 |
| 13 | TypeScript in the browser (Vite) | 🚧 |
| 14 | Configuration & tooling | 🚧 |
| 15 | Bridge to React | 🚧 |
| 16 | [Capstone](final-project/) | 🚧 |

Exercise types are marked in each README: ✍️ **write the code**, 🔧 **fix the type errors**, 🏷️ **add types to existing JS**.

## Repo layout

```
modules/NN-topic/
  README.md                 lesson, common mistakes, check-your-understanding, Handbook links
  exercises/NN-name/
    README.md               task + acceptance criteria
    starter.ts              ← you edit this
    solution.ts             reference solution with "why" comments
    *.test.ts               runtime + type tests
  project/                  mini-project (same layout as an exercise)
playground/                 scratch space with the course tsconfig
final-project/              capstone spec
scripts/                    the npm script helpers
```

## The one idea to keep in mind

**Types disappear at runtime.** TypeScript checks your code *before* it runs, then erases every annotation. Data that arrives while the program runs (JSON, `fetch`, form inputs, `localStorage`) has never been checked by anyone. Every module points out where this matters, and Module 12 shows how to validate untrusted data properly.
