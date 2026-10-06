// The tip calculator, typed.

// Inferred as `number[]`. No annotation needed when the value says it all.
export const TIP_PRESETS = [10, 15, 20];

// Naming the shape lets other functions accept it without repeating it.
export interface BillSplit {
  total: number;
  perPerson: number;
}

export function calculateTip(bill: number, percent: number): number {
  return Math.round(bill * percent) / 100;
}

export function splitBill(bill: number, tipPercent: number, people: number): BillSplit {
  const total = bill + calculateTip(bill, tipPercent);
  return { total, perPerson: Math.round((total / people) * 100) / 100 };
}

export function formatSummary(split: BillSplit, people: number): string {
  return `Total: $${split.total.toFixed(2)} (${people} × $${split.perPerson.toFixed(2)})`;
}

// Once the parameters are typed as `string`, passing them to `splitBill`
// (which wants numbers) is an error. That error points straight at the bug:
// `"50" + 7.5` concatenates to "507.5". Convert at the boundary where the
// strings enter the program, and let everything inside work with numbers.
export function splitFromForm(billText: string, tipText: string, peopleText: string): BillSplit {
  return splitBill(Number(billText), Number(tipText), Number(peopleText));
}
