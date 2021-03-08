export enum AccountType {
  LOAN = "Loan",
  CREDIT = "Credit Card",
  CHECKING = "Checking",
  SAVING = "Saving",
  CASH = "Cash"
}

export interface Account {
  type: AccountType,
  name: string,
  id: string,
}

export function parseAccount(data: string): Account {
  const parsed: Account = JSON.parse(data);
  return parsed;
}

export function parseAccounts(data: string): Account[] {
  if(typeof data !== 'undefined') {
    return data
      .split('\n')
      .map(i => i.length > 0 ? parseAccount(i) : undefined)
      .filter(i => typeof i !== 'undefined');
  }
  return [];
}
