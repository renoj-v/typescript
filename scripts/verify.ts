// Course-maintenance check (you don't need this as a learner):
//   1. every solution passes its tests, type-checks, and lints cleanly
//   2. every untouched starter FAILS its tests
// Usage: npm run verify [-- <lesson>]
import { copyFileSync, cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT, findSolvableDirs, rel, resolveLesson, run } from "./lib.ts";

const lessonArg = process.argv[2];
const dirs = lessonArg === undefined ? findSolvableDirs() : [resolveLesson(lessonArg)];
console.log(`Verifying ${String(dirs.length)} lesson(s)\n`);

// 1. Solutions: copy the course into .verify/, swap each solution in as the starter.
const workDir = join(ROOT, ".verify");
rmSync(workDir, { recursive: true, force: true });
for (const entry of readdirSync(ROOT)) {
  if (["node_modules", ".git", ".verify"].includes(entry)) continue;
  cpSync(join(ROOT, entry), join(workDir, entry), { recursive: true });
}
// Swap in *every* solution (not just the target's) so the whole-course tsc run is clean.
for (const dir of findSolvableDirs()) {
  const copy = join(workDir, relative(ROOT, dir));
  copyFileSync(join(copy, "solution.ts"), join(copy, "starter.ts"));
}
const scopes = lessonArg === undefined ? ["lessons/"] : dirs.map((dir) => `${rel(dir)}/`);
const solutionTests = await run("vitest", ["run", ...scopes], { cwd: workDir, quiet: true });
const solutionTypes = await run("tsc", ["--noEmit", "-p", "tsconfig.json"], { cwd: workDir, quiet: true });
const solutionFiles = dirs.map((dir) => join(dir, "solution.ts"));
const lint = await run("eslint", solutionFiles, { quiet: true });

// 2. Starters: each one must fail on its own.
const results: { dir: string; failed: boolean }[] = [];
const queue = [...dirs];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    for (let dir = queue.shift(); dir !== undefined; dir = queue.shift()) {
      const { code } = await run("vitest", ["run", `${rel(dir)}/`], { quiet: true });
      results.push({ dir, failed: code !== 0 });
    }
  }),
);

const passingStarters = results.filter((r) => !r.failed).map((r) => rel(r.dir));
const report = (ok: boolean, label: string) => {
  console.log(`${ok ? "✔" : "✖"} ${label}`);
};
report(solutionTests.code === 0, "All solutions pass their runtime + type tests");
report(solutionTypes.code === 0, "All solutions type-check (tsc --noEmit)");
report(lint.code === 0, "All solutions pass ESLint");
report(passingStarters.length === 0, `Every starter fails its tests (${String(dirs.length)} checked)`);

if (solutionTests.code !== 0) console.log(`\n--- vitest (solutions) ---\n${solutionTests.output}`);
if (solutionTypes.code !== 0) console.log(`\n--- tsc (solutions) ---\n${solutionTypes.output}`);
if (lint.code !== 0) console.log(`\n--- eslint (solutions) ---\n${lint.output}`);
if (passingStarters.length > 0) console.log(`\nStarters that unexpectedly pass:\n  ${passingStarters.join("\n  ")}`);

const ok = solutionTests.code === 0 && solutionTypes.code === 0 && lint.code === 0 && passingStarters.length === 0;
if (ok && existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
process.exit(ok ? 0 : 1);
