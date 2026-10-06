// Config helpers. Everything is `any`, so TypeScript can't see the bugs.
// Step 1: replace every `any` with `unknown`. Step 2: fix the errors.

/** Provided helper: true if `value` is a non-null object. (Part 5 explains `value is ...`.) */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// 1. Returns the length of a string, or 0 for anything that isn't a string.
export function safeLength(value: any): number {
  return value.length;
}

// 2. Returns `config.server.port` if it's a number; otherwise the default, 3000.
export function getPort(config: any): number {
  return config.server.port;
}

// 3. Upper-cases every string in the list and skips everything else.
export function shoutAll(values: any[]): string[] {
  return values.map((value) => value.toUpperCase());
}

// 4. `JSON.parse` returns `any`. Wrap it so callers receive `unknown` instead.
export function parseJson(text: string): any {
  return JSON.parse(text);
}
