import { Account } from '../models/Account'

export const ACCOUNTING = "accounting";
export const LOAD_ACCOUNTS = "load-accounts";

export const loadAccounts = (accounts: Account[]) => {
  return {
    type: ACCOUNTING,
    operation: LOAD_ACCOUNTS,
    payload: accounts,
  }
}
