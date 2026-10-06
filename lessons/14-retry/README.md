# Lesson 14: A typed `retry` for flaky requests

**Type:** ✍️ Write the code · **Time:** ~25 min

## Scenario

The payment provider's API fails now and then. Instead of failing the whole checkout, you want to retry the request a few times:

```ts
const receiptId = await retry(() => chargeCard(order), {
  attempts: 3,
  delayMs: 200,
  onRetry: (attempt, error) => console.warn(`Attempt ${attempt} failed`, error),
});
```

## Your task

1. **Types**
   - `Task`: a function with no parameters that returns a `Promise<string>`
   - `RetryOptions`: an object with
     - `attempts: number` (required): the total number of tries
     - `delayMs?: number` (optional): the wait between tries
     - `onRetry?: (attempt: number, error: unknown) => void` (optional): called after each failed try *that will be retried*
2. **`sleep(ms: number): Promise<void>`** resolves after `ms` milliseconds.
3. **`retry(task, options): Promise<string>`**
   - Calls `task()`. If it resolves, return its value.
   - If it rejects and tries remain, call `onRetry(attemptNumber, error)` (if given), wait `delayMs` (default `0`), and try again. Attempt numbers start at `1`.
   - When there are no tries left, re-throw the **last** error.
   - If `attempts < 1`, throw a `RangeError` without calling `task`.

## Acceptance criteria

- [ ] Types match the spec exactly (checked by type tests)
- [ ] Callers may leave out `delayMs` and `onRetry`
- [ ] All tests pass

> 🔮 This `retry` only works for tasks returning `Promise<string>`. In Part 7 you'll use **generics** to make `retry<T>` work for any result type.

<details>
<summary>Hint: calling an optional callback</summary>

`options.onRetry?.(attempt, error)` calls it only if it's defined.

</details>
