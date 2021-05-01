import { updateCars, updateTankEntries } from '../actions/consumption/car';

function isNotEmpty(str: string) {
  return str &&  str.length > 0;
}

function parse(str: string) {
  return JSON.parse(str);
}

class CarFuelService {
  fetchCars() {
    return async (dispatch: any, getState: any) => {
      // @ts-ignore
      const data = await window.filesystem.readFile("consumption/cars.json");
      const cars = data.split('\n').filter(isNotEmpty).map(parse);

      dispatch(updateCars(cars))
    }
  }

  fetchTankEntries() {
    return async (dispatch: any, getState: any) => {
      // @ts-ignore
      const data = await window.filesystem.readDirectory("consumption/cars");
      const entries = data.split('\n').filter(isNotEmpty).map(parse);

      dispatch(updateTankEntries(entries))
    }
  }
}

export default new CarFuelService();
