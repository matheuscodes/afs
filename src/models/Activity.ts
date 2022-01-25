import { Account } from './Account'

export enum Currency {
  EUR = "€",
}

export interface Charge {
  amount: number;
  currency: Currency;
}

export interface Activity {
  date: Date;
  source: string;
  description: string;
  value: Charge;
  account: string;
  transfer: boolean;
  category: string;
}

export function parseActivity(data: string) {
  const parsed: Activity = JSON.parse(data);
  parsed.date = new Date(parsed.date);
  parsed.value.amount = parseFloat(`${parsed.value.amount}`);
  return parsed;
}

export function parseActivities(data: string) {
  if(typeof data !== 'undefined') {
    return data
      .split('\n')
      .map(i => i.length > 0 ? parseActivity(i) : undefined)
      .filter(i => typeof i !== 'undefined')
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  return [];
}
