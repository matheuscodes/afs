import { v4 as uuidv4 } from 'uuid';
import { Currency, Charge, Activity, parseActivity, parseActivities } from '../models/Activity'
import { Account, parseAccounts } from '../models/Account'
import { addActivity, loadActivities } from '../actions/bookkeeping'
import { loadAccounts } from '../actions/accounting'

const BOOKKEEPING_LOCATION = "./storage/bookkeeping"

class Bookkeeping {
  openRequests: any = {}

  constructor() {
    // @ts-ignore
    window.storage.listenData("bookkeeping", (request: any) => {
      this.updateData(request);
    });

    // @ts-ignore
    window.storage.listenData("accounting", (request: any) => {
      this.updateData(request);
    });
  }

  updateData(request: any) {
    console.log("updateData", request);
    const { action, dispatch, dataParser } = this.openRequests[request.requestId];
    dispatch(action(dataParser(request.data)));
  }

  writeActivity(activity: Activity) {
    return async (dispatch: any, getState: any) => {
      const requestId = uuidv4();
      // @ts-ignore
      window.storage.appendData({
        requestId,
        path: "bookkeeping",
        file: activity.date.toJSON().substring(0,7),
        data: JSON.stringify(activity),
      });

      this.openRequests[requestId] = {
        dispatch,
        action: addActivity,
        dataParser: parseActivity,
      };
    }
  }

  loadActivities() {
    return async (dispatch: any, getState: any) => {
      const requestId = uuidv4();
      // @ts-ignore
      window.storage.loadAllFiles({
        requestId,
        path: "bookkeeping"
      });

      this.openRequests[requestId] = {
        dispatch,
        action: loadActivities,
        dataParser: parseActivities,
      };
    }
  }

  loadAccounts() {
    return async (dispatch: any, getState: any) => {
      const requestId = uuidv4();
      // @ts-ignore
      window.storage.loadAllFiles({
        requestId,
        path: "accounting"
      });

      this.openRequests[requestId] = {
        dispatch,
        action: loadAccounts,
        dataParser: parseAccounts,
      };
    }
  }
}

export default new Bookkeeping();
