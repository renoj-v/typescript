// Overload signatures: the only call shapes callers can see.
export function makeDate(iso: string): Date;
export function makeDate(year: number, month: number, day: number): Date;
// Implementation signature: must accept every overload. It's hidden from
// callers, so `makeDate(2026, 3)` matches no overload and is rejected.
export function makeDate(isoOrYear: string | number, month?: number, day?: number): Date {
  const date =
    typeof isoOrYear === "string"
      ? new Date(isoOrYear) // "2026-03-15" (date-only) is parsed as UTC
      : // Inside the implementation TS can't link `isoOrYear: number` to
        // `month`/`day` being defined, so `?? NaN` handles the impossible case.
        new Date(Date.UTC(isoOrYear, (month ?? Number.NaN) - 1, day ?? Number.NaN));

  // Types can't tell us whether "2026-13-45" is a real date. Check at runtime.
  if (Number.isNaN(date.getTime())) throw new RangeError(`Invalid date: ${String(isoOrYear)}`);
  return date;
}

// Here overloads really matter: the *return type* follows the input type,
// so callers get `string` or `string[]` instead of `string | string[]`.
export function formatAmount(amount: number): string;
export function formatAmount(amounts: number[]): string[];
export function formatAmount(input: number | number[]): string | string[] {
  const format = (n: number) => `$${n.toFixed(2)}`;
  return Array.isArray(input) ? input.map(format) : format(input);
}
