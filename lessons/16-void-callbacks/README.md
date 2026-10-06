# Lesson 16: `void` vs `undefined` in callbacks

**Type:** 🔧 Fix the type errors · **Time:** ~15 min

## Scenario

A document editor runs "save hooks" every time a document is saved (analytics, search indexing, backups). The hooks module has type errors, and every one of them comes from mixing up `void`, `undefined` and "returns a value".

## Your task

Fix the **three** type errors in `starter.ts` so each function does what its comment says:

1. `SaveHook` rejects a perfectly reasonable hook (`trackSave`). Fix the **type**, not the hook.
2. `runHooks` should report how many hooks it ran. Its return type says otherwise.
3. `findTitle` doesn't return on every path (TS7030, from `noImplicitReturns`). Make the "not found" case explicit.

## Rules

- Don't change `trackSave`'s body.
- No `any` or `// @ts-ignore`.

## Acceptance criteria

- [ ] `SaveHook` is `(doc: Doc) => void`
- [ ] `runHooks` returns a `number`
- [ ] `saveDocument(doc, [trackSave, trackSave])` → `'Saved "Notes" (2 hooks)'`
- [ ] `findTitle` returns the title, or `undefined` when there's no match
- [ ] All tests pass

<details>
<summary>Why does `void` fix #1?</summary>

`savedIds.push(...)` returns the new array length (a number). A callback type returning `undefined` demands that the function return exactly `undefined`. A callback type returning `void` says "whatever you return will be ignored", so a function returning a number is fine.

</details>
