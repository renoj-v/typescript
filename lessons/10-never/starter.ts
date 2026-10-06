export type OrderStatus = "pending" | "shipped" | "delivered";

// 1. TODO: give this the right return type.
export function fail(message: string) {
  throw new Error(message);
}

// 2. TODO: return env[name], or call `fail` if it's missing.
export function requireEnv(env: Record<string, string | undefined>, name: string): string {
  const value = env[name];
  return value;
}

// 3. TODO: type the parameter and the return value, then throw.
export function assertNever(value) {}

// 4. TODO: read the error on `assertNever(status)` and fix it.
export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "⏳ Pending";
    case "shipped":
      return "🚚 Shipped";
    default:
      return assertNever(status);
  }
}
