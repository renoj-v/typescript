// Gradebook summary. See README.md for the full spec.

// TODO: replace these with the real types from the spec.
export type Student = unknown;
export type GradeSummary = unknown;
export type ClassReport = unknown;

export function parseStudent(line) {
  throw new Error("TODO: parseStudent");
}

export function average(scores) {
  throw new Error("TODO: average");
}

export function letterGrade(avg) {
  throw new Error("TODO: letterGrade");
}

export function summarize(student) {
  throw new Error("TODO: summarize");
}

export function classReport(students) {
  throw new Error("TODO: classReport");
}

export function formatReport(report) {
  throw new Error("TODO: formatReport");
}

// --- Demo: runs only via `npm run lesson 11` ---
const exported = `Ada, 92, 88, 95
Grace, 78, 85, 80
Linus, 65, 70, 58`;

if (import.meta.main) {
  const students = exported.split("\n").map((line) => parseStudent(line));
  console.log(formatReport(classReport(students)));
}
