// Helpers shared by the course scripts (exercise, typecheck, verify).
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

export const ROOT = resolve(import.meta.dirname, "..");
export const MODULES_DIR = join(ROOT, "modules");

const pad = (n: string) => n.padStart(2, "0");

function findChild(dir: string, prefix: string): string | undefined {
  if (!existsSync(dir)) return undefined;
  const match = readdirSync(dir).find((name) => name.startsWith(`${prefix}-`) || name === prefix);
  return match === undefined ? undefined : join(dir, match);
}

/**
 * Turn CLI args like `05 02` or `5 project` into an absolute folder path.
 * Exits with a helpful message if the folder doesn't exist.
 */
export function resolveTarget(moduleArg: string | undefined, exerciseArg?: string): string {
  if (moduleArg === undefined) {
    fail("Usage: <module> [exercise|project], e.g. `05 02` or `05 project`");
  }
  const moduleDir = findChild(MODULES_DIR, pad(moduleArg));
  if (moduleDir === undefined) fail(`No module found for "${moduleArg}" in modules/`);
  if (exerciseArg === undefined) return moduleDir;
  if (exerciseArg === "project") {
    const projectDir = join(moduleDir, "project");
    if (!existsSync(projectDir)) fail(`Module "${moduleArg}" has no project/ folder`);
    return projectDir;
  }
  const exerciseDir = findChild(join(moduleDir, "exercises"), pad(exerciseArg));
  if (exerciseDir === undefined) fail(`No exercise "${exerciseArg}" in ${rel(moduleDir)}/exercises`);
  return exerciseDir;
}

/** Every folder in the course that contains a `solution.ts`. */
export function findSolvableDirs(base = MODULES_DIR): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === "node_modules") continue;
      const full = join(dir, entry.name);
      if (existsSync(join(full, "solution.ts"))) found.push(full);
      walk(full);
    }
  };
  if (existsSync(base)) walk(base);
  return found.sort();
}

export const rel = (path: string) => relative(ROOT, path) || ".";

export function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/** Run a binary from node_modules/.bin. Resolves with its exit code. */
export function run(
  bin: string,
  args: string[],
  options: { cwd?: string; quiet?: boolean } = {},
): Promise<{ code: number; output: string }> {
  return new Promise((done) => {
    const child = spawn(join(ROOT, "node_modules", ".bin", bin), args, {
      cwd: options.cwd ?? ROOT,
      stdio: options.quiet === true ? "pipe" : "inherit",
      env: { ...process.env, FORCE_COLOR: options.quiet === true ? "0" : "1" },
    });
    let output = "";
    child.stdout?.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.stderr?.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.on("close", (code) => {
      done({ code: code ?? 1, output });
    });
  });
}
