import { LONG_TERM, LOAD_UPKEEPS, LOAD_SAVINGS } from '../actions/long-term'

function longTermReducer(state: any = {}, action: any) {
  if(action.type === LONG_TERM) {
    switch (action.operation) {
      case LOAD_UPKEEPS:
        return {...state, upkeep: action.payload};
      case LOAD_SAVINGS:
        return {...state, savings: action.payload};
      default:
        return state;
    }
  }
  return state;
}

export default longTermReducer;
