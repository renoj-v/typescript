# Lesson 10: `never`, the type for things that can't happen

**Type:** ✍️ Write the code · **Time:** ~15 min

## Scenario

An order-tracking service needs three small things: a helper that always throws, a function that reads required environment variables, and a status label that can't silently miss a status.

`OrderStatus` is a **union type**: a value that is one of `"pending"`, `"shipped"` or `"delivered"`. Parts 5 and 6 explain unions properly. For now, just use it.

## Your task

1. **`fail(message)`** always throws an `Error`. Give it the `never` return type. Without the annotation, TypeScript infers `void` for a function declaration, even when it can only throw.
2. **`requireEnv(env, name)`** returns `env[name]` as a `string`. If it's missing, call `fail` with a message containing the variable name. Use `??`. This only type-checks once `fail` returns `never`.
3. **`assertNever(value)`** takes a `never` parameter and returns `never`. It throws an `Error` mentioning the unexpected value.
4. **`statusLabel(status)`** returns `"⏳ Pending"`, `"🚚 Shipped"` or `"📦 Delivered"`. The `default` branch calls `assertNever(status)`. Right now there's an error because a case is missing. Read it, then add the case.

## Acceptance criteria

- [ ] `fail` and `assertNever` return `never`, and `assertNever` only accepts `never`
- [ ] `requireEnv({ PORT: "8080" }, "PORT")` → `"8080"`; a missing name throws an error mentioning the name
- [ ] `statusLabel` handles every status
- [ ] All tests pass

<details>
<summary>Why does assertNever(status) catch missing cases?</summary>

Inside the `default` branch, TypeScript has removed every status you handled. If you've handled them all, `status` is `never` and the call is fine. If you forgot one, `status` is that leftover value (e.g. `"delivered"`), which isn't assignable to `never`, so you get a compile error pointing at the gap. Part 5 uses this pattern a lot.

</details>
