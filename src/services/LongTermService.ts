import { loadUpkeeps, loadSavings } from '../actions/long-term';
import { parseActivities } from '../models/Activity';
import { parseAccounts } from '../models/Account';

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
      let files = await Promise.all(list.map((i: string) => {
        // @ts-ignore
        return window.filesystem.readFile(`long-term/upkeep/${i}`);
      }))

      const upkeeps = files.filter(isNotEmpty).map(parse);

      dispatch(loadUpkeeps(upkeeps))
    }
  }

  loadSavings() {
    return async (dispatch: any, getState: any) => {
      // @ts-ignore
      let list = await window.filesystem.listFiles(`bookkeeping/`);
      let files = await Promise.all(list.map((i: string) => {
        // @ts-ignore
        return window.filesystem.readFile(`bookkeeping/${i}`);
      }))

      // @ts-ignore
      let accountList = await window.filesystem.readFile(`accounting/account.list.json`)

      const accounts: any = {}
      parseAccounts(accountList).forEach(account => accounts[account.id] = account);

      const bookkeeping = files.filter(isNotEmpty).map(parseActivities).flatMap(x => x);

      const savings = bookkeeping.map((activity: any) => {
        activity.source = accounts[activity.source];
        activity.account = accounts[activity.account];
        return activity;
      }).filter((activity: any) =>
        (activity.account && activity.account.type === 'Saving')
        || (activity.source && activity.source.type === 'Saving')
      )

      dispatch(loadSavings(savings))
    }
  }
}

export default new LongTermService();
