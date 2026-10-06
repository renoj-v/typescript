import { describe, expect, expectTypeOf, test, vi } from "vitest";
import { type RetryOptions, type Task, retry, sleep } from "./starter";

/** A task that fails `failures` times, then resolves with "ok". */
function flaky(failures: number) {
  let calls = 0;
  const task = vi.fn(() => {
    calls++;
    return calls <= failures ? Promise.reject(new Error(`fail #${calls}`)) : Promise.resolve("ok");
  });
  return task;
}

describe("types", () => {
  test("Task and RetryOptions", () => {
    expectTypeOf<Task>().toEqualTypeOf<() => Promise<string>>();
    expectTypeOf<RetryOptions>().toEqualTypeOf<{
      attempts: number;
      delayMs?: number;
      onRetry?: (attempt: number, error: unknown) => void;
    }>();
  });

  test("functions", () => {
    expectTypeOf(sleep).toEqualTypeOf<(ms: number) => Promise<void>>();
    expectTypeOf(retry).toEqualTypeOf<(task: Task, options: RetryOptions) => Promise<string>>();
  });

  test("delayMs and onRetry are optional", () => {
    expectTypeOf(retry).toBeCallableWith(() => Promise.resolve("x"), { attempts: 2 });
    // @ts-expect-error - attempts is required
    expectTypeOf(retry).toBeCallableWith(() => Promise.resolve("x"), {});
    // @ts-expect-error - the task must resolve to a string
    expectTypeOf(retry).toBeCallableWith(() => Promise.resolve(42), { attempts: 2 });
  });
});

describe("sleep", () => {
  test("resolves", async () => {
    await expect(sleep(1)).resolves.toBeUndefined();
  });
});

describe("retry", () => {
  test("returns the first success", async () => {
    const task = flaky(0);
    await expect(retry(task, { attempts: 3 })).resolves.toBe("ok");
    expect(task).toHaveBeenCalledTimes(1);
  });

  test("retries until it succeeds", async () => {
    const task = flaky(2);
    await expect(retry(task, { attempts: 3, delayMs: 0 })).resolves.toBe("ok");
    expect(task).toHaveBeenCalledTimes(3);
  });

  test("re-throws the last error when out of attempts", async () => {
    const task = flaky(5);
    await expect(retry(task, { attempts: 3 })).rejects.toThrow("fail #3");
    expect(task).toHaveBeenCalledTimes(3);
  });

  test("calls onRetry only before retries", async () => {
    const onRetry = vi.fn();
    await expect(retry(flaky(5), { attempts: 3, onRetry })).rejects.toThrow();
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, new Error("fail #1"));
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, new Error("fail #2"));
  });

  test("rejects attempts < 1 without calling the task", async () => {
    const task = flaky(0);
    await expect(retry(task, { attempts: 0 })).rejects.toThrow(RangeError);
    expect(task).not.toHaveBeenCalled();
  });
});
