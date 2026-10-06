// npm run lesson 7            → run lesson 07's starter, then its tests
// npm run lesson 7 -- --watch → re-run the tests every time you save
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fail, rel, resolveLesson, run } from "./lib.ts";

const args = process.argv.slice(2);
const watch = args.includes("--watch") || args.includes("-w");
const dir = resolveLesson(args.find((arg) => !arg.startsWith("-")));
const starter = join(dir, "starter.ts");
if (!existsSync(starter)) fail(`No starter.ts in ${rel(dir)}`);

console.log(`\n▶ Running ${rel(starter)}\n`);
const result = await run("tsx", [starter]);
if (result.code !== 0) console.log("\n(The starter threw at runtime. See the output above.)");

console.log(`\n▶ Testing ${rel(dir)} (runtime + type tests)\n`);
const tests = await run("vitest", [watch ? "watch" : "run", `${rel(dir)}/`]);
process.exit(tests.code);
