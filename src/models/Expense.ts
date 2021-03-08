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
  parsed.value.amount = parseFloat(`${parsed.value.amount}`);
  return parsed;
}

export function parseExpenses(data: string) {
  if(typeof data !== 'undefined') {
    return data
      .split('\n')
      .map(i => i.length > 0 ? parseExpense(i) : undefined)
      .filter(i => typeof i !== 'undefined')
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  return [];
}
