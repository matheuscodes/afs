import { Account } from '../models/Account'
import { ACCOUNTING, LOAD_ACCOUNTS } from '../actions/accounting'

export default (state: {accounts?: Record<string, Account>} = {}, action: any) => {
  console.log("accounting reducer", action);
  if(action.type === ACCOUNTING) {
    switch (action.operation) {
      case LOAD_ACCOUNTS:
        const accounts:Record<string, Account> = {};
        action.payload.forEach((i: Account) => accounts[i.id] = i);
        return {accounts, ...state};
      default:
        return state;
    }
  }
  return state;
};
