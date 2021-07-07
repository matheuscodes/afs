import { LONG_TERM, LOAD_UPKEEPS } from '../actions/long-term'

export default (state: any = {}, action: any) => {
  console.log("long-term reducer", action)
  if(action.type === LONG_TERM) {
    switch (action.operation) {
      case LOAD_UPKEEPS:
        return {...state, upkeep: action.payload};
      default:
        return state;
    }
  }
  return state;
};
