// npm run exercise 05 02          → run the starter, then its tests
// npm run exercise 05 project     → same for the module's mini-project
// npm run exercise 05 02 --watch  → re-run the tests every time you save
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fail, rel, resolveTarget, run } from "./lib.ts";

const args = process.argv.slice(2);
const watch = args.includes("--watch") || args.includes("-w");
const [moduleArg, exerciseArg] = args.filter((arg) => !arg.startsWith("-"));
if (exerciseArg === undefined) fail("Usage: npm run exercise <module> <exercise|project> [--watch]");

const dir = resolveTarget(moduleArg, exerciseArg);
const starter = join(dir, "starter.ts");
if (!existsSync(starter)) fail(`No starter.ts in ${rel(dir)}`);

console.log(`\n▶ Running ${rel(starter)}\n`);
const result = await run("tsx", [starter]);
if (result.code !== 0) console.log("\n(The starter threw at runtime. See the output above.)");

console.log(`\n▶ Testing ${rel(dir)} (runtime + type tests)\n`);
const tests = await run("vitest", [watch ? "watch" : "run", `${rel(dir)}/`]);
process.exit(tests.code);
