import { Home } from '../models/Home'
import { HOME_CONSUMPTION, UPDATE_HOMES } from '../../actions/consumption/home'

export default (state: Record<string, Home> = {}, action: any) => {
  console.log("home reducer", action);
  if(action.type === HOME_CONSUMPTION) {
    switch (action.operation) {
      case UPDATE_HOMES:
        const homes: Record<string, Home> = {};
        action.payload.forEach((i: Home) => homes[i.id] = {
          ...i,
          heaters: [],
        });
        return {...state, ...homes};
      default:
        return state;
    }
  }
  return state;
};
