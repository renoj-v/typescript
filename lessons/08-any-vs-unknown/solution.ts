// Config helpers, made safe with `unknown`.

/** Provided helper: true if `value` is a non-null object. (Part 5 explains `value is ...`.) */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// `unknown` accepts any input, like `any`, but you can't *use* the value
// until you've checked what it is. With `any`, `[1, 2].length` "worked" and
// returned 2, and `null.length` crashed.
export function safeLength(value: unknown): number {
  return typeof value === "string" ? value.length : 0;
}

// Each check narrows one level deeper. After `isObject(config)`,
// `config.server` is `unknown`, so it has to be checked too.
export function getPort(config: unknown): number {
  if (isObject(config) && isObject(config.server) && typeof config.server.port === "number") {
    return config.server.port;
  }
  return 3000;
}

// TypeScript 5.5+ infers that this callback is a type guard, so `filter`
// returns `string[]` and `.toUpperCase()` is allowed in the `map`.
export function shoutAll(values: unknown[]): string[] {
  return values.filter((value) => typeof value === "string").map((value) => value.toUpperCase());
}

// Changing only the return type is enough. `any` is assignable to `unknown`,
// and from here on callers must check what they got.
export function parseJson(text: string): unknown {
  return JSON.parse(text);
}
