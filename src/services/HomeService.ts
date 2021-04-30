import { updateHomes, updateElectricity } from '../actions/consumption/home';

class HomeService {
  fetchHomes() {
    return async (dispatch: any, getState: any) => {
      const data = await window.filesystem.readFile("consumption/homes/homes.json");
      const homes = data.split('\n').filter(i => i.length).map(i => JSON.parse(i));

      dispatch(updateHomes(homes))
    }
  }

  fetchElectricity(homeId: string) {
    return async (dispatch: any, getState: any) => {
      let data;

      data = await window.filesystem.readFile(`consumption/homes/${homeId}/electricity/measurements.json`);
      const measurements = data.split('\n').filter(i => i.length).map(i => JSON.parse(i));
      data = await window.filesystem.readFile(`consumption/homes/${homeId}/electricity/payments.json`);
      const payments = data.split('\n').filter(i => i.length).map(i => JSON.parse(i));
      data = await window.filesystem.readFile(`consumption/homes/${homeId}/electricity/prices.json`);
      const prices = data.split('\n').filter(i => i.length).map(i => JSON.parse(i));

      dispatch(updateElectricity(homeId, measurements, payments, prices))
    }
  }
}

export default new HomeService();
