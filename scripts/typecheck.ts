// npm run typecheck              → type-check the whole course (except solutions)
// npm run typecheck -- 05        → just one module
// npm run typecheck -- 05 02     → just one exercise (or `05 project`)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, rel, resolveTarget, run } from "./lib.ts";

const [moduleArg, exerciseArg] = process.argv.slice(2);

if (moduleArg === undefined) {
  const { code } = await run("tsc", ["--noEmit", "-p", "tsconfig.json"]);
  if (code === 0) console.log("✔ No type errors.");
  process.exit(code);
}

const dir = resolveTarget(moduleArg, exerciseArg);
// A throwaway tsconfig that only includes the target folder.
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
