# Lesson 11 (project): Gradebook summary

**Time:** ~45 min · **Uses:** object types, arrays, tuples, `noUncheckedIndexedAccess`, turning strings from outside into typed data

## The spec

A teacher exports scores as lines of comma-separated text. Turn them into a class report.

```
Ada, 92, 88, 95
Grace, 78, 85, 80
Linus, 65, 70, 58
```

### Types (replace the `unknown`s)

```ts
type Student = { name: string; scores: number[] };
type GradeSummary = { name: string; average: number; letter: string; best: number; worst: number };
type ClassReport = {
  students: GradeSummary[];
  classAverage: number;
  top: [name: string, average: number]; // a tuple
};
```

### Functions

| Function | Behavior |
|---|---|
| `parseStudent(line: string): Student` | `"Ada, 92, 88"` → `{ name: "Ada", scores: [92, 88] }`. Trim whitespace. Throw an `Error` if the name is empty, there are no scores, or a score isn't a number. The message should include the bad text. |
| `average(scores: number[]): number` | Mean rounded to **1 decimal** (`Math.round(x * 10) / 10`). `0` for an empty list. |
| `letterGrade(avg: number): string` | `≥ 90` A, `≥ 80` B, `≥ 70` C, `≥ 60` D, otherwise F |
| `summarize(student: Student): GradeSummary` | Average, letter, best and worst score |
| `classReport(students: Student[]): ClassReport` | Summaries in input order, the average of the students' averages (1 decimal) and the top student. Throw if `students` is empty. |
| `formatReport(report: ClassReport): string` | See below |

### `formatReport` output

Each student row is `name.padEnd(10) + average.toFixed(1).padStart(5) + "  " + letter`:

```
Ada        91.7  A
Grace      81.0  B
Linus      64.3  D
Class average: 79.0
Top student: Ada (91.7)
```

## Run it

```bash
npm run lesson 11
```

## Acceptance criteria

- [ ] The three types match the spec (`top` is a tuple)
- [ ] All functions have typed parameters and return types, with no `any`
- [ ] Bad input lines throw helpful errors
- [ ] All tests pass

## Stretch goals (untested)

1. Add `parseGradebook(text: string): Student[]` that skips blank lines and reports *which line number* failed.
2. Make `letterGrade` return the union `"A" | "B" | "C" | "D" | "F"` instead of `string` (preview of Part 6).
3. Add `+`/`-` grades (e.g. `B+` for 87–89).
