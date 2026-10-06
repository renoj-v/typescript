# 03.02: An event logger with function types and rest params

**Type:** ✍️ Write the code · **Time:** ~25 min

## Scenario

Build a tiny logger for a checkout service. It should work like this:

```ts
const logger = createLogger(defaultFormatter);
const stop = logger.subscribe((entry) => sendToMonitoring(entry));

logger.log("warn", "Low stock for", "SKU-42", "-", 3, "left");
// → "2026-01-01T00:00:00.000Z [WARN] Low stock for SKU-42 - 3 left"

stop(); // unsubscribe
```

## Your task

Replace the `unknown` types with function and object types, then implement:

1. **Types**
   - `Formatter`: a function taking a `LogEntry` and returning a `string`
   - `Listener`: a function taking a `LogEntry` whose return value is ignored
   - `Logger`: an object with:
     - `log`: takes a `LogLevel`, then **any number** of `string | number` parts, and returns `string`
     - `subscribe`: takes a `Listener` and returns an unsubscribe function `() => void`
2. **`joinParts(...parts)`** joins any number of strings/numbers with single spaces.
3. **`defaultFormatter`** is a `Formatter` producing `"<ISO time> [LEVEL] message"`, e.g. `"2026-01-01T00:00:00.000Z [WARN] Low stock"`.
4. **`createLogger(format, clock = Date.now)`** returns a `Logger`. `log` builds a `LogEntry` (using `clock()` for the timestamp), calls every current listener with it, and returns the formatted string. `subscribe` returns a function that removes that listener.

## Acceptance criteria

- [ ] `Formatter`, `Listener` and `Logger` match the descriptions (checked by type tests)
- [ ] `log` accepts any number of parts, but only strings and numbers
- [ ] Unsubscribed listeners aren't called
- [ ] All tests pass

<details>
<summary>Hint: a method with a rest parameter in an object type</summary>

```ts
type Example = {
  add: (label: string, ...values: number[]) => number;
};
```

</details>
