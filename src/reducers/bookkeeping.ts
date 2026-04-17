import { BOOKKEEPING, ADD_ACTIVITY, LOAD_ACTIVITIES } from '../actions/bookkeeping'

function bookkeepingReducer(state: any[] = [], action: any) {
  if(action.type === BOOKKEEPING) {
    switch (action.operation) {
      case ADD_ACTIVITY:
        return state.concat(action.payload);
      case LOAD_ACTIVITIES:
        return action.payload;
      default:
        return state;
    }
  }
  return state;
}

export default bookkeepingReducer;
