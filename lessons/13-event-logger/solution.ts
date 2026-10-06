export type LogLevel = "info" | "warn" | "error";

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: number;
};

// A function type expression: parameter names are labels; types are what count.
export type Formatter = (entry: LogEntry) => string;

// `void`: we ignore the result, so listeners can return anything
// (e.g. `(entry) => sent.push(entry)` returns a number, and that's fine).
export type Listener = (entry: LogEntry) => void;

export type Logger = {
  // A rest parameter inside a function type.
  log: (level: LogLevel, ...parts: (string | number)[]) => string;
  // A function that returns a function.
  subscribe: (listener: Listener) => () => void;
};

export function joinParts(...parts: (string | number)[]): string {
  return parts.join(" ");
}

// Annotating the *variable* with `Formatter` contextually types `entry`,
// so the arrow function itself needs no annotations.
export const defaultFormatter: Formatter = (entry) =>
  `${new Date(entry.timestamp).toISOString()} [${entry.level.toUpperCase()}] ${entry.message}`;

// `clock` defaults to Date.now, and tests pass a fake clock. Injecting a
// function like this is a cheap way to make time-based code testable.
export function createLogger(format: Formatter, clock: () => number = Date.now): Logger {
  const listeners = new Set<Listener>();

  return {
    log(level, ...parts) {
      // `level` and `parts` are contextually typed from `Logger["log"]`.
      const entry: LogEntry = { level, message: joinParts(...parts), timestamp: clock() };
      for (const listener of listeners) listener(entry);
      return format(entry);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
