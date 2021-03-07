import { ADD_EXPENSE } from '../actions/bookkeeping'

export default (state: any[] = [], action: any) => {
  switch (action.operation) {
    case ADD_EXPENSE:
      console.log(ADD_EXPENSE, action.payload)
      return state.concat(action.payload);
    default:
      return state;
  }
};
