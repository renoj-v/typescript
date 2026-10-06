// A function type with no parameters that resolves to a string.
export type Task = () => Promise<string>;

export type RetryOptions = {
  attempts: number;
  delayMs?: number;
  // `error` is `unknown` because a rejected promise can carry *anything*:
  // an Error, a string, undefined... (Part 12 covers handling it.)
  onRetry?: (attempt: number, error: unknown) => void;
};

// `Promise<void>`: it resolves, but with no useful value.
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry(task: Task, options: RetryOptions): Promise<string> {
  // Destructuring with a default: `delayMs` is `number` here, not `number | undefined`.
  const { attempts, delayMs = 0, onRetry } = options;
  if (attempts < 1) throw new RangeError(`attempts must be at least 1, got ${attempts}`);

  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        onRetry?.(attempt, error); // optional call: does nothing if undefined
        await sleep(delayMs);
      }
    }
  }
  // Re-throwing `unknown` is allowed. `throw` accepts any value.
  throw lastError;
}
