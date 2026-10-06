// Gradebook summary: reference solution.

export type Student = { name: string; scores: number[] };

export type GradeSummary = {
  name: string;
  average: number;
  letter: string;
  best: number;
  worst: number;
};

export type ClassReport = {
  students: GradeSummary[];
  classAverage: number;
  // A labeled tuple: short, positional data with a fixed length.
  top: [name: string, average: number];
};

export function parseStudent(line: string): Student {
  // Text from a file is just a string. Nothing guarantees its shape, so
  // every assumption gets checked here, at the boundary.
  const [rawName, ...rawScores] = line.split(",").map((part) => part.trim());

  // Destructuring an array gives `string | undefined` for `rawName`
  // (noUncheckedIndexedAccess), so the empty check also handles "missing".
  if (rawName === undefined || rawName === "") throw new Error(`Missing student name in "${line}"`);
  if (rawScores.length === 0) throw new Error(`No scores for ${rawName}`);

  const scores = rawScores.map((raw) => {
    const score = Number(raw);
    // Number("abc") is NaN, and Number("") is 0. Reject both.
    if (raw === "" || Number.isNaN(score)) throw new Error(`Invalid score "${raw}" for ${rawName}`);
    return score;
  });

  return { name: rawName, scores };
}

export function average(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((total, score) => total + score, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

export function letterGrade(avg: number): string {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
}

export function summarize(student: Student): GradeSummary {
  const avg = average(student.scores);
  return {
    name: student.name,
    average: avg,
    letter: letterGrade(avg),
    best: Math.max(...student.scores),
    worst: Math.min(...student.scores),
  };
}

export function classReport(students: Student[]): ClassReport {
  const summaries = students.map(summarize);
  const [first, ...rest] = summaries;
  // `first` is `GradeSummary | undefined`. Handling it lets TypeScript prove
  // there's a top student.
  if (first === undefined) throw new Error("Cannot build a report with no students");

  const best = rest.reduce((top, s) => (s.average > top.average ? s : top), first);
  return {
    students: summaries,
    classAverage: average(summaries.map((s) => s.average)),
    top: [best.name, best.average],
  };
}

export function formatReport(report: ClassReport): string {
  const rows = report.students.map(
    (s) => `${s.name.padEnd(10)}${s.average.toFixed(1).padStart(5)}  ${s.letter}`,
  );
  // Destructuring a tuple: both values are always defined.
  const [topName, topAverage] = report.top;
  return [
    ...rows,
    `Class average: ${report.classAverage.toFixed(1)}`,
    `Top student: ${topName} (${topAverage.toFixed(1)})`,
  ].join("\n");
}

// --- Demo: runs only via `npm run lesson 11` ---
const exported = `Ada, 92, 88, 95
Grace, 78, 85, 80
Linus, 65, 70, 58`;

if (import.meta.main) {
  const students = exported.split("\n").map((line) => parseStudent(line));
  console.log(formatReport(classReport(students)));
}
