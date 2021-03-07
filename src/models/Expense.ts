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
