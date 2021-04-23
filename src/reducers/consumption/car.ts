import { Car } from '../models/Account'
import { CAR_CONSUMPTION, UPDATE_CARS, UPDATE_CAR_TANK_ENTRIES } from '../../actions/consumption/car'

export default (state: {cars?: Record<string, Car>} = {}, action: any) => {
  console.log("car reducer", action);
  if(action.type === CAR_CONSUMPTION) {
    switch (action.operation) {
      case UPDATE_CARS:
        const cars:Record<string, Car> = {};
        action.payload.forEach((i: Car) => cars[i.id] = {...i, tankEntries: []});
        return {...state, cars};
      case UPDATE_CAR_TANK_ENTRIES:
        action.payload.forEach(entry => state.cars[entry.carId].tankEntries.push(entry))
        return JSON.parse(JSON.stringify(state));
      default:
        return state;
    }
  }
  return state;
};
