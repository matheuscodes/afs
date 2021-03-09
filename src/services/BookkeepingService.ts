import { v4 as uuidv4 } from 'uuid';
import { Currency, Charge, Activity, parseActivity, parseActivities } from '../models/Activity'
import { Account, AccountType, parseAccounts } from '../models/Account'
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

  monthlyOverview(year: number, month: number, activities: Activity[], accounts: Record<string, Account>) {
    const filterByType = (a: Activity, type: AccountType) => {
      const account = accounts[a.account];
      if(a.transfer) {
        const sourceAccount = accounts[a.source];
        return typeof account !== 'undefined'
          && typeof sourceAccount !== 'undefined'
          && (account.type === type || sourceAccount.type === type)
      } else {
        return typeof account !== 'undefined'
          && account.type === type
      }
    }

    const lastMonthFilter = (a: Activity) => {
      const activityMonth = a.date.getMonth();
      const activityYear = a.date.getFullYear();
      if(month > 0) {
        return activityMonth < month && activityYear <= year
      } else {
        return activityYear < year
      }
    }

    const thisMonthFilter = (a: Activity) => {
      const activityMonth = a.date.getMonth();
      const activityYear = a.date.getFullYear();
      return activityMonth === month && activityYear === year;
    }

    const reducer = (accumulator: Charge, a: Activity): Charge => {
      if(a.account === a.source) {
        return accumulator;
      }
      if(a.transfer) {
        return {
          amount: accumulator.amount - a.value.amount,
          currency: accumulator.currency,
        }
      } else {
        return {
          amount: accumulator.amount + a.value.amount,
          currency: accumulator.currency,
        }
      }
    }

    const filterByIncome = (a: Activity) => {
      if(a.transfer) {
        return a.value.amount < 0 && thisMonthFilter(a);
      } else {
        return a.value.amount > 0 && thisMonthFilter(a);
      }
    }

    const filterByExpense = (a: Activity) => {
      if(a.transfer) {
        return a.value.amount > 0 && thisMonthFilter(a);
      } else {
        return a.value.amount < 0 && thisMonthFilter(a);
      }
    }

    const creditActivities = activities.filter(activity => filterByType(activity, AccountType.CREDIT));
    const checkingActivities = activities.filter(activity => filterByType(activity, AccountType.CHECKING));
    const cashActivities = activities.filter(activity => filterByType(activity, AccountType.CASH));

    const lastMonth: any = {
      credit: creditActivities.filter(lastMonthFilter).reduce(reducer, {amount:0, currency: Currency.EUR}),
      checking: checkingActivities.filter(lastMonthFilter).reduce(reducer, {amount:0, currency: Currency.EUR}),
      cash: cashActivities.filter(lastMonthFilter).reduce(reducer, {amount:0, currency: Currency.EUR}),
    }
    const thisMonth: any = {
      credit: creditActivities.filter(thisMonthFilter).reduce(reducer, {amount:0, currency: Currency.EUR}),
      checking: checkingActivities.filter(thisMonthFilter).reduce(reducer, {amount:0, currency: Currency.EUR}),
      cash: cashActivities.filter(thisMonthFilter).reduce(reducer, {amount:0, currency: Currency.EUR}),
    }

    return {
      lastMonth,
      current: {
        credit: {
          amount: lastMonth.credit.amount + thisMonth.credit.amount,
          currency: lastMonth.credit.currency
        },
        checking: {
          amount: lastMonth.checking.amount + thisMonth.checking.amount,
          currency: lastMonth.checking.currency
        },
        cash: {
          amount: lastMonth.cash.amount + thisMonth.cash.amount,
          currency: lastMonth.cash.currency
        },
      },
      total: {
        expenses: checkingActivities.concat(cashActivities).filter(filterByExpense).reduce(reducer, {amount:0, currency: Currency.EUR}),
        income: checkingActivities.concat(cashActivities).filter(filterByIncome).reduce(reducer, {amount:0, currency: Currency.EUR})
      }
    }

  }
}

export default new Bookkeeping();
