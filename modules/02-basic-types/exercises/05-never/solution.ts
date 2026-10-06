export type OrderStatus = "pending" | "shipped" | "delivered";

// Function *declarations* that only throw are inferred as `void`. TypeScript
// assumes you might add a return later. `never` states "this never returns".
export function fail(message: string): never {
  throw new Error(message);
}

export function requireEnv(env: Record<string, string | undefined>, name: string): string {
  // `string | undefined` ?? `never` → `string`. `never` vanishes from unions,
  // because a value of type never can't exist.
  return env[name] ?? fail(`Missing environment variable: ${name}`);
}

// A `never` parameter means only "impossible" values may be passed. At
// runtime it still throws, in case bad data sneaks in from outside the types.
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "⏳ Pending";
    case "shipped":
      return "🚚 Shipped";
    case "delivered":
      return "📦 Delivered";
    default:
      // Every case is handled, so `status` is `never` here. Add a fourth
      // status to OrderStatus and this line becomes a compile error.
      return assertNever(status);
  }
}
