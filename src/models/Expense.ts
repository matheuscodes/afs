export enum Currency {
  EUR = "€",
}

export interface Charge {
  amount: number;
  currency: Currency;
}

export interface Expense {
  date: Date;
  source: string;
  description: string;
  value: Charge;
}

export function parseExpense(data: string) {
  const parsed: Expense = JSON.parse(data);
  parsed.date = new Date(parsed.date);
  return parsed;
}
