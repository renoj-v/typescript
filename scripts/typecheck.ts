// npm run typecheck        → type-check the whole course (except solutions)
// npm run typecheck -- 7   → just lesson 07
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, rel, resolveLesson, run } from "./lib.ts";

const lessonArg = process.argv[2];

if (lessonArg === undefined) {
  const { code } = await run("tsc", ["--noEmit", "-p", "tsconfig.json"]);
  if (code === 0) console.log("✔ No type errors.");
  process.exit(code);
}

const dir = resolveLesson(lessonArg);
// A throwaway tsconfig that only includes the target lesson.
const cacheDir = join(ROOT, "node_modules", ".cache", "course");
mkdirSync(cacheDir, { recursive: true });
const configPath = join(cacheDir, "tsconfig.target.json");
writeFileSync(
  configPath,
  JSON.stringify({
    extends: join(ROOT, "tsconfig.base.json"),
    include: [join(dir, "**/*")],
    exclude: [join(dir, "**/solution.ts")],
  }),
);
console.log(`Type-checking ${rel(dir)} …`);
const { code } = await run("tsc", ["--noEmit", "-p", configPath]);
if (code === 0) console.log("✔ No type errors.");
process.exit(code);
