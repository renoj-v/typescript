# 01.03: Types vanish at runtime

**Type:** ✍️ Write the code · **Time:** ~20 min

## Scenario

An app stores user settings as JSON. The current loader does `JSON.parse(json) as Settings`. It compiles, but `as` checks **nothing**. If the JSON is missing a field, or a field has the wrong type, the app finds out much later, in some unrelated place.

## Part A: see the erasure (not tested, ~3 min)

Compile the starter to JavaScript and look at what's left:

```bash
cd modules/01-why-typescript/exercises/03-types-vanish
npx tsc starter.ts --target es2023 --outDir out
cat out/starter.js
```

Notice that `interface Settings` and every `: string` / `as Settings` are gone. That's why the runtime can't protect you. Delete `out/` when you're done.

## Part B: write `parseSettings`

Implement `parseSettings(json: string): Settings` so it **checks the data at runtime**:

- Return `{ username, fontSize }` when `username` is a string and `fontSize` is a number.
- Return a **new object** with only those two fields. Extra properties in the JSON are dropped.
- Throw an `Error` whose message contains the field name (`"username"` or `"fontSize"`) when that field is missing or has the wrong type.
- Throw an `Error` whose message contains `"object"` if the JSON isn't an object at all (e.g. `"42"` or `"null"`).

## Acceptance criteria

- [ ] All tests pass and there are no type errors
- [ ] No `any`, and no `as Settings`

<details>
<summary>Hint</summary>

Store the parsed value as `unknown`: `const data: unknown = JSON.parse(json)`. Then check it with `typeof`:

```ts
if (typeof data !== "object" || data === null) throw new Error("Settings must be an object");
```

Once you know it's an object, `const record = data as Record<string, unknown>` lets you read properties as `unknown`. That's safe because you'll check each one with `typeof` before using it. Module 5 shows cleaner ways to do this narrowing, and Module 12 uses Zod.

</details>
