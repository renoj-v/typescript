export type Doc = { id: string; title: string };

// 1. `void` in a function *type* means "the caller ignores the result".
//    Functions that return something (like `push`, which returns a number)
//    are still assignable. `undefined` would demand they return undefined.
export type SaveHook = (doc: Doc) => void;

export const savedIds: string[] = [];

export const trackSave: SaveHook = (doc) => savedIds.push(doc.id);

// 2. `void` on a function *declaration* means "returns nothing useful", so
//    `return hooks.length` contradicted it. If callers need the value,
//    say what it is.
export function runHooks(doc: Doc, hooks: SaveHook[]): number {
  for (const hook of hooks) hook(doc); // results are ignored, as `void` promised
  return hooks.length;
}

export function saveDocument(doc: Doc, hooks: SaveHook[]): string {
  const count = runHooks(doc, hooks);
  return `Saved "${doc.title}" (${String(count)} hooks)`;
}

// 3. With `noImplicitReturns`, falling off the end of a function that
//    returns `string | undefined` is an error. An explicit `return undefined`
//    shows the "not found" case was intentional.
export function findTitle(docs: Doc[], id: string): string | undefined {
  for (const doc of docs) {
    if (doc.id === id) return doc.title;
  }
  return undefined;
}
