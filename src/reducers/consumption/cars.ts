import { Car, CarTankEntry } from '../../models/Car'
import { CAR_CONSUMPTION, UPDATE_CARS, UPDATE_CAR_TANK_ENTRIES } from '../../actions/consumption/car'

export default (state: Record<string, Car> = {}, action: any) => {
  console.log("car reducer", action);
  if(action.type === CAR_CONSUMPTION) {
    switch (action.operation) {
      case UPDATE_CARS:
        const cars:Record<string, Car> = {};
        action.payload.forEach((i: Car) => cars[i.id] = {...i, tankEntries: [] as CarTankEntry[]});
        return {...state, ...cars};
      case UPDATE_CAR_TANK_ENTRIES:
        action.payload.forEach((entry: CarTankEntry) => state[entry.carId].tankEntries.push(entry))
        return JSON.parse(JSON.stringify(state));
      default:
        return state;
    }
  }
  return state;
};
