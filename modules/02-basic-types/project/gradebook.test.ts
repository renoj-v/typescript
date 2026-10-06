import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type ClassReport,
  type GradeSummary,
  type Student,
  average,
  classReport,
  formatReport,
  letterGrade,
  parseStudent,
  summarize,
} from "./starter";

const students: Student[] = [
  { name: "Ada", scores: [92, 88, 95] },
  { name: "Grace", scores: [78, 85, 80] },
  { name: "Linus", scores: [65, 70, 58] },
];

describe("types", () => {
  test("shapes", () => {
    expectTypeOf<Student>().toEqualTypeOf<{ name: string; scores: number[] }>();
    expectTypeOf<GradeSummary>().toEqualTypeOf<{
      name: string;
      average: number;
      letter: string;
      best: number;
      worst: number;
    }>();
    expectTypeOf<ClassReport>().toEqualTypeOf<{
      students: GradeSummary[];
      classAverage: number;
      top: [string, number];
    }>();
  });

  test("signatures", () => {
    expectTypeOf(parseStudent).toEqualTypeOf<(line: string) => Student>();
    expectTypeOf(average).toEqualTypeOf<(scores: number[]) => number>();
    expectTypeOf(letterGrade).toEqualTypeOf<(avg: number) => string>();
    expectTypeOf(summarize).toEqualTypeOf<(student: Student) => GradeSummary>();
    expectTypeOf(classReport).toEqualTypeOf<(students: Student[]) => ClassReport>();
    expectTypeOf(formatReport).toEqualTypeOf<(report: ClassReport) => string>();
  });
});

describe("parseStudent", () => {
  test("parses a line", () => {
    expect(parseStudent(" Ada , 92, 88 ,95")).toEqual({ name: "Ada", scores: [92, 88, 95] });
  });
  test("rejects bad lines", () => {
    expect(() => parseStudent("Ada")).toThrow();
    expect(() => parseStudent(", 90")).toThrow();
    expect(() => parseStudent("Ada, 90, ninety")).toThrow(/ninety/);
    expect(() => parseStudent("Ada, 90, ")).toThrow();
  });
});

describe("math", () => {
  test("average rounds to 1 decimal", () => {
    expect(average([92, 88, 95])).toBe(91.7);
    expect(average([])).toBe(0);
  });

  test.each([
    [95, "A"],
    [90, "A"],
    [89.9, "B"],
    [80, "B"],
    [70, "C"],
    [60, "D"],
    [59.9, "F"],
  ])("letterGrade(%d) → %s", (avg, letter) => {
    expect(letterGrade(avg)).toBe(letter);
  });

  test("summarize", () => {
    expect(summarize({ name: "Ada", scores: [92, 88, 95] })).toEqual({
      name: "Ada",
      average: 91.7,
      letter: "A",
      best: 95,
      worst: 88,
    });
  });
});

describe("classReport", () => {
  test("builds the report", () => {
    const report = classReport(students);
    expect(report.students.map((s) => s.name)).toEqual(["Ada", "Grace", "Linus"]);
    expect(report.classAverage).toBe(79);
    expect(report.top).toEqual(["Ada", 91.7]);
  });

  test("throws with no students", () => {
    expect(() => classReport([])).toThrow();
  });

  test("formatReport", () => {
    expect(formatReport(classReport(students))).toBe(
      [
        "Ada        91.7  A",
        "Grace      81.0  B",
        "Linus      64.3  D",
        "Class average: 79.0",
        "Top student: Ada (91.7)",
      ].join("\n"),
    );
  });
});
