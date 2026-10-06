import { defineConfig } from "vitest/config";

const testFiles = ["lessons/**/*.test.ts", "lessons/**/*.test.tsx", "final-project/**/*.test.ts"];

export default defineConfig({
  test: {
    include: testFiles,
    exclude: ["**/node_modules/**", ".verify/**"],
    // Type tests: the same *.test.ts files are also run through `tsc`, so
    // `expectTypeOf(...)` and `// @ts-expect-error` assertions are checked,
    // and a type error in the starter file you're working on fails the run.
    typecheck: {
      enabled: true,
      include: testFiles,
      tsconfig: "./tsconfig.json",
    },
  },
});
