import { beforeEach, describe, expect, expectTypeOf, test } from "vitest";
import { type Doc, type SaveHook, findTitle, runHooks, saveDocument, savedIds, trackSave } from "./starter";

const doc: Doc = { id: "d1", title: "Notes" };

beforeEach(() => {
  savedIds.length = 0;
});

describe("types", () => {
  test("SaveHook returns void", () => {
    expectTypeOf<SaveHook>().toEqualTypeOf<(doc: Doc) => void>();
  });
  test("runHooks returns a number", () => {
    expectTypeOf(runHooks).returns.toEqualTypeOf<number>();
  });
  test("findTitle", () => {
    expectTypeOf(findTitle).returns.toEqualTypeOf<string | undefined>();
  });
});

describe("hooks", () => {
  test("trackSave records the id", () => {
    trackSave(doc);
    expect(savedIds).toEqual(["d1"]);
  });

  test("runHooks runs every hook and counts them", () => {
    const seen: string[] = [];
    expect(runHooks(doc, [trackSave, (d) => seen.push(d.title)])).toBe(2);
    expect(savedIds).toEqual(["d1"]);
    expect(seen).toEqual(["Notes"]);
  });

  test("saveDocument", () => {
    expect(saveDocument(doc, [trackSave, trackSave])).toBe('Saved "Notes" (2 hooks)');
  });
});

describe("findTitle", () => {
  test("found and not found", () => {
    expect(findTitle([doc], "d1")).toBe("Notes");
    expect(findTitle([doc], "nope")).toBeUndefined();
  });
});
