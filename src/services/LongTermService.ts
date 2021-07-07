import { loadUpkeeps } from '../actions/long-term';

function isNotEmpty(str: string) {
  return str &&  str.length > 0;
}

function parse(str: string) {
  return JSON.parse(str);
}

class LongTermService {
  loadUpkeeps() {
    return async (dispatch: any, getState: any) => {
      // @ts-ignore
      let list = await window.filesystem.listFiles(`long-term/upkeep/`);
      let files = await Promise.all(list.map(i => {
        // @ts-ignore
        return window.filesystem.readFile(`long-term/upkeep/${i}`);
      }))

      const upkeeps = files.filter(isNotEmpty).map(parse);

      dispatch(loadUpkeeps(upkeeps))
    }
  }
}

export default new LongTermService();
