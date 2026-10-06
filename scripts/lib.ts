// Helpers shared by the course scripts (lesson, typecheck, verify).
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

export const ROOT = resolve(import.meta.dirname, "..");
export const LESSONS_DIR = join(ROOT, "lessons");

/**
 * Turn a CLI arg like `7` or `07` into an absolute lesson folder path.
 * Exits with a helpful message if the lesson doesn't exist.
 */
export function resolveLesson(lessonArg: string | undefined): string {
  if (lessonArg === undefined || !/^\d+$/.test(lessonArg)) {
    fail("Usage: give a lesson number, e.g. `npm run lesson 7`");
  }
  const prefix = `${lessonArg.padStart(2, "0")}-`;
  const match = existsSync(LESSONS_DIR)
    ? readdirSync(LESSONS_DIR).find((name) => name.startsWith(prefix))
    : undefined;
  if (match === undefined) fail(`No lesson ${lessonArg} in lessons/`);
  return join(LESSONS_DIR, match);
}

/** Every lesson folder that contains a `solution.ts`. */
export function findSolvableDirs(): string[] {
  if (!existsSync(LESSONS_DIR)) return [];
  return readdirSync(LESSONS_DIR)
    .map((name) => join(LESSONS_DIR, name))
    .filter((dir) => existsSync(join(dir, "solution.ts")))
    .sort();
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
