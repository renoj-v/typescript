export interface Settings {
  username: string;
  fontSize: number;
}

// ❌ Compiles, but lies: `as Settings` performs no runtime check at all.
export function loadSettingsUnsafe(json: string): Settings {
  return JSON.parse(json) as Settings;
}

export function parseSettings(json: string): Settings {
  // `JSON.parse` returns `any`, which would let us do anything unchecked.
  // Annotating as `unknown` forces us to prove what it is before using it.
  const data: unknown = JSON.parse(json);

  // `typeof null === "object"` in JavaScript, so null needs its own check.
  if (typeof data !== "object" || data === null) {
    throw new Error("Settings must be an object");
  }

  // We've proven it's a non-null object. Reading its properties as `unknown`
  // is honest: we still don't claim to know their types.
  const record = data as Record<string, unknown>;

  if (typeof record.username !== "string") {
    throw new Error(`"username" must be a string, got ${typeof record.username}`);
  }
  if (typeof record.fontSize !== "number") {
    throw new Error(`"fontSize" must be a number, got ${typeof record.fontSize}`);
  }

  // After the checks, TypeScript has *narrowed* each field to its real type.
  // Building a fresh object drops any unexpected extra properties.
  return { username: record.username, fontSize: record.fontSize };
}
