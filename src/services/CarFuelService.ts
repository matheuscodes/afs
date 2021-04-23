import { updateCars, updateTankEntries } from '../actions/consumption/car';

class CarFuelService {
  fetchCars() {
    return async (dispatch: any, getState: any) => {
      const data = await window.filesystem.readFile("consumption/cars.json");
      const cars = data.split('\n').filter(i => i.length).map(i => JSON.parse(i));

      dispatch(updateCars(cars))
    }
  }

  fetchTankEntries() {
    return async (dispatch: any, getState: any) => {
      const data = await window.filesystem.readDirectory("consumption/cars");
      const entries = data.split('\n').filter(i => i.length).map(i => JSON.parse(i));

      dispatch(updateTankEntries(entries))
    }
  }
}

export default new CarFuelService();
