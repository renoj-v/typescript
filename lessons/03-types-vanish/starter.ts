export interface Settings {
  username: string;
  fontSize: number;
}

// ❌ Compiles, but lies: `as Settings` performs no runtime check at all.
export function loadSettingsUnsafe(json: string): Settings {
  return JSON.parse(json) as Settings;
}

// TODO: Check the parsed data at runtime. Return a real Settings object,
// or throw an Error whose message names the bad field. See README.md.
export function parseSettings(json: string): Settings {

  const data: unknown = JSON.parse(json);
  if (typeof data !== "object" || data === null) {
    throw new Error("null or not an object given for Settings")
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.username !== "string") {
    throw new Error("not valid username");
  }
  if (typeof obj.fontSize !== "number") {
    throw new Error("not valid fontSize");
  }

  return { username: obj.username, fontSize: obj.fontSize }
}
