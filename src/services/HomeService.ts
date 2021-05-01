import { updateHomes, updateElectricity, updateGas } from '../actions/consumption/home';

function isNotEmpty(str: string) {
  return str &&  str.length > 0;
}

function parse(str: string) {
  return JSON.parse(str);
}

class HomeService {
  fetchHomes() {
    return async (dispatch: any, getState: any) => {
      // @ts-ignore
      const data = await window.filesystem.readFile("consumption/homes/homes.json");
      const homes = data.split('\n').filter(isNotEmpty).map(parse);

      dispatch(updateHomes(homes))
    }
  }

  fetchElectricity(homeId: string) {
    return async (dispatch: any, getState: any) => {
      let data;

      // @ts-ignore
      data = await window.filesystem.readFile(`consumption/homes/${homeId}/electricity/measurements.json`);
      const measurements = data.split('\n').filter(isNotEmpty).map(parse);
      // @ts-ignore
      data = await window.filesystem.readFile(`consumption/homes/${homeId}/electricity/payments.json`);
      const payments = data.split('\n').filter(isNotEmpty).map(parse);
      // @ts-ignore
      data = await window.filesystem.readFile(`consumption/homes/${homeId}/electricity/prices.json`);
      const prices = data.split('\n').filter(isNotEmpty).map(parse);

      dispatch(updateElectricity(homeId, measurements, payments, prices))
    }
  }

  fetchGas(homeId: string) {
    return async (dispatch: any, getState: any) => {
      let data;

      // @ts-ignore
      data = await window.filesystem.readFile(`consumption/homes/${homeId}/gas/measurements.json`);
      const measurements = data.split('\n').filter(isNotEmpty).map(parse);
      // @ts-ignore
      data = await window.filesystem.readFile(`consumption/homes/${homeId}/gas/payments.json`);
      const payments = data.split('\n').filter(isNotEmpty).map(parse);
      // @ts-ignore
      data = await window.filesystem.readFile(`consumption/homes/${homeId}/gas/prices.json`);
      const prices = data.split('\n').filter(isNotEmpty).map(parse);

      dispatch(updateGas(homeId, measurements, payments, prices))
    }
  }
}

export default new HomeService();
