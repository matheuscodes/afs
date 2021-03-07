import { ADD_EXPENSE, LOAD_EXPENSES } from '../actions/bookkeeping'

export default (state: any[] = [], action: any) => {
  console.log("bookkeeping reducer", action)
  switch (action.operation) {
    case ADD_EXPENSE:
      return state.concat(action.payload);
    case LOAD_EXPENSES:
      return action.payload;
    default:
      return state;
  }
};
