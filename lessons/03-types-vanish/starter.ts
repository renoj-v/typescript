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
  throw new Error(`TODO: implement parseSettings (got ${json.length} chars)`);
}
