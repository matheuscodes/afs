import { updateHomes } from '../actions/consumption/home';

class HomeService {
  fetchHomes() {
    return async (dispatch: any, getState: any) => {
      const data = await window.filesystem.readFile("consumption/homes/homes.json");
      const homes = data.split('\n').filter(i => i.length).map(i => JSON.parse(i));

      dispatch(updateHomes(homes))
    }
  }
}

export default new HomeService();
