export type Doc = { id: string; title: string };

// 1. A save hook receives the saved document. Its return value is ignored.
export type SaveHook = (doc: Doc) => undefined;

export const savedIds: string[] = [];

// Don't change this body: hooks written as one-line arrows are common.
export const trackSave: SaveHook = (doc) => savedIds.push(doc.id);

// 2. Runs every hook and returns how many ran.
export function runHooks(doc: Doc, hooks: SaveHook[]): void {
  for (const hook of hooks) hook(doc);
  return hooks.length;
}

export function saveDocument(doc: Doc, hooks: SaveHook[]): string {
  const count = runHooks(doc, hooks);
  return `Saved "${doc.title}" (${String(count)} hooks)`;
}

// 3. Returns the title of the doc with this id, or undefined if there's none.
export function findTitle(docs: Doc[], id: string): string | undefined {
  for (const doc of docs) {
    if (doc.id === id) return doc.title;
  }
}
