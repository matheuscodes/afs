import { ADD_EXPENSE } from '../actions/bookkeeping'

export default (state = [], action) => {
  switch (action.operation) {
    case ADD_EXPENSE:
      return state.concat(action.payload);
    default:
      console.log("Invalid action", action);
      return state;
  }
};
