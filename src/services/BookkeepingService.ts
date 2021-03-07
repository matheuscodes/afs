import { v4 as uuidv4 } from 'uuid';
import { Currency, Charge, Expense, parseExpense } from '../models/Expense'
import { addExpense } from '../actions/bookkeeping'

const BOOKKEEPING_LOCATION = "./storage/bookkeeping"

class Bookkeeping {
  openRequests: any = {}

  constructor() {
    // @ts-ignore
    window.storage.listenData("bookkeeping", (request: any) => {
      this.updateData(request);
    });
  }

  updateData(request: any) {
    console.log("updateData", request);
    const { action, dispatch } = this.openRequests[request.requestId];
    dispatch(action(parseExpense(request.data)));
  }

  writeExpense(expense: Expense) {
    return async (dispatch: any, getState: any) => {
      const requestId = uuidv4();
      // @ts-ignore
      window.storage.appendData({
        requestId,
        path: "bookkeeping",
        file: expense.date.toJSON().substring(0,7),
        data: JSON.stringify(expense),
      });

      this.openRequests[requestId] = {
        dispatch,
        action: addExpense,
      };
    }
  }
}

export default new Bookkeeping();
