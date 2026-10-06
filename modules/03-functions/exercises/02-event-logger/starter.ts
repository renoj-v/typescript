export type LogLevel = "info" | "warn" | "error";

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: number;
};

// TODO: function and object types. See README.md.
export type Formatter = unknown;
export type Listener = unknown;
export type Logger = unknown;

export function joinParts(...parts) {
  throw new Error("TODO: joinParts");
}

// TODO: annotate as a Formatter and implement.
export const defaultFormatter = (entry) => {
  throw new Error("TODO: defaultFormatter");
};

export function createLogger(format, clock = Date.now) {
  throw new Error("TODO: createLogger");
}
