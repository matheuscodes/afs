export enum Currency {
  EUR = "€",
}

export interface Charge {
  amount: float;
  currency: Currency;
}

export default interface Expense {
  date: Date;
  source: string;
  description: string;
  value: Charge;
}

export function parseExpense(data) {
  const parsed: Expense = JSON.parse(data);
  parsed.date = new Date(parsed.date);
  return parsed;
}
