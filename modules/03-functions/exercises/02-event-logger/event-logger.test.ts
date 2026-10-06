import { describe, expect, expectTypeOf, test } from "vitest";
import {
  type Formatter,
  type Listener,
  type LogEntry,
  type Logger,
  type LogLevel,
  createLogger,
  defaultFormatter,
  joinParts,
} from "./starter";

const fixedClock = () => Date.UTC(2026, 0, 1);

describe("types", () => {
  test("Formatter and Listener", () => {
    expectTypeOf<Formatter>().toEqualTypeOf<(entry: LogEntry) => string>();
    expectTypeOf<Listener>().toEqualTypeOf<(entry: LogEntry) => void>();
  });

  test("Logger", () => {
    expectTypeOf<Logger>().toEqualTypeOf<{
      log: (level: LogLevel, ...parts: (string | number)[]) => string;
      subscribe: (listener: Listener) => () => void;
    }>();
  });

  test("functions", () => {
    expectTypeOf(joinParts).toEqualTypeOf<(...parts: (string | number)[]) => string>();
    expectTypeOf(defaultFormatter).toEqualTypeOf<Formatter>();
    expectTypeOf(createLogger).returns.toEqualTypeOf<Logger>();
    expectTypeOf(createLogger).toBeCallableWith(defaultFormatter);
    expectTypeOf(createLogger).toBeCallableWith(defaultFormatter, fixedClock);
  });

  test("log only accepts strings and numbers", () => {
    const logger = createLogger(defaultFormatter, fixedClock);
    expectTypeOf(logger.log).toBeCallableWith("info", "a", 1, "b");
    // @ts-expect-error - booleans are not allowed
    expectTypeOf(logger.log).toBeCallableWith("info", true);
    // @ts-expect-error - "debug" is not a LogLevel
    expectTypeOf(logger.log).toBeCallableWith("debug", "x");
  });
});

describe("joinParts", () => {
  test("joins with spaces", () => {
    expect(joinParts("Low stock for", "SKU-42", "-", 3, "left")).toBe("Low stock for SKU-42 - 3 left");
    expect(joinParts()).toBe("");
  });
});

describe("defaultFormatter", () => {
  test("formats an entry", () => {
    expect(defaultFormatter({ level: "warn", message: "Low stock", timestamp: fixedClock() })).toBe(
      "2026-01-01T00:00:00.000Z [WARN] Low stock",
    );
  });
});

describe("createLogger", () => {
  test("log returns the formatted line", () => {
    const logger = createLogger(defaultFormatter, fixedClock);
    expect(logger.log("error", "Payment failed:", 402)).toBe(
      "2026-01-01T00:00:00.000Z [ERROR] Payment failed: 402",
    );
  });

  test("uses the formatter it was given", () => {
    const logger = createLogger((entry) => `${entry.level}:${entry.message}`, fixedClock);
    expect(logger.log("info", "hi")).toBe("info:hi");
  });

  test("notifies listeners until they unsubscribe", () => {
    const logger = createLogger(defaultFormatter, fixedClock);
    const received: LogEntry[] = [];
    const stop = logger.subscribe((entry) => received.push(entry));

    logger.log("info", "first");
    stop();
    logger.log("info", "second");

    expect(received).toEqual([{ level: "info", message: "first", timestamp: fixedClock() }]);
  });
});
