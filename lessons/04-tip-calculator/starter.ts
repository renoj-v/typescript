// Copied from a JavaScript project. Make it compile under strict mode,
// then fix the bug that the types reveal. See README.md.

export const TIP_PRESETS = [10, 15, 20];

// TODO: export interface BillSplit { ... }

export function calculateTip(bill, percent) {
  return Math.round(bill * percent) / 100;
}

export function splitBill(bill, tipPercent, people) {
  const total = bill + calculateTip(bill, tipPercent);
  return { total, perPerson: Math.round((total / people) * 100) / 100 };
}

export function formatSummary(split, people) {
  return `Total: $${split.total.toFixed(2)} (${people} × $${split.perPerson.toFixed(2)})`;
}

// Values come straight from <input> elements, so they are always strings.
export function splitFromForm(billText, tipText, peopleText) {
  return splitBill(billText, tipText, peopleText);
}
