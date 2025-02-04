import { Account } from '../models/Account'
import { ACCOUNTING, LOAD_ACCOUNTS } from '../actions/accounting'

export default (state: {accounts?: Record<string, Account>} = {}, action: any) => {
  if(action.type === ACCOUNTING) {
    switch (action.operation) {
      case LOAD_ACCOUNTS:
        const accounts:Record<string, Account> = {};
        action.payload.forEach((i: Account) => accounts[i.id] = i);
        return {...state, accounts};
      default:
        return state;
    }
  }
  return state;
};
