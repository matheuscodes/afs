import { v4 as uuidv4 } from 'uuid';
import { Currency, Charge, Activity, parseActivity, parseActivities } from '../models/Activity'
import { Account, AccountType, parseAccounts } from '../models/Account'
import { addActivity, loadActivities } from '../actions/bookkeeping'
import { loadAccounts } from '../actions/accounting'

const BOOKKEEPING_LOCATION = "./storage/bookkeeping"

interface SmallActivity {
  date: Date,
  transfer: boolean,
  amount: number,
  currency: Currency,
  category: string,
}

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
    const accountActivities: Record<string, SmallActivity[]> = {}
    Object.keys(accounts).forEach(i => accountActivities[i] = [])
    activities.forEach((a: Activity) => {
      if(accountActivities[a.account]) {
        accountActivities[a.account].push({
          date: a.date,
          transfer: a.transfer,
          category: a.category,
          amount: a.value.amount,
          currency: a.value.currency,
        });
      }
      if(a.transfer) {
        if(accountActivities[a.source]) {
          accountActivities[a.source].push({
            date: a.date,
            transfer: a.transfer,
            category: a.category,
            amount: -a.value.amount,
            currency: a.value.currency,
          });
        }
      }
    });

    const tillNowFilter = (a: SmallActivity) => {
      const activityMonth = a.date.getMonth();
      const activityYear = a.date.getFullYear();
      if(activityYear == year) {
        return activityMonth <= month
      } else {
        return activityYear < year
      }
    }

    const lastMonthFilter = (a: SmallActivity) => {
      const activityMonth = a.date.getMonth();
      const activityYear = a.date.getFullYear();
      if(activityYear == year) {
        return activityMonth < month
      } else {
        return activityYear < year
      }
    }

    const thisMonthFilter = (a: SmallActivity) => {
      const activityMonth = a.date.getMonth();
      const activityYear = a.date.getFullYear();
      return activityMonth === month && activityYear === year;
    }

    const reducer = (accumulator: Charge, a: SmallActivity): Charge => {
      return {
        amount: accumulator.amount + a.amount,
        currency: accumulator.currency,
      }
    }

    const filterByIncome = (a: SmallActivity) => {
      return a.amount > 0 && thisMonthFilter(a) && !a.transfer;
    }

    const filterByExpense = (a: SmallActivity) => {
      if(a.transfer) {
        if(a.category) {
          return a.amount < 0 && thisMonthFilter(a);
        }
      }
      return a.amount < 0 && thisMonthFilter(a) && !a.transfer;
    }

    const filterAccountByType = (a: Account, type: AccountType) => a.type === type;

    const creditActivities = Object.keys(accountActivities)
                                   .map(key => accounts[key])
                                   .filter((account: Account) => filterAccountByType(account, AccountType.CREDIT))
                                   .flatMap((account: Account) => accountActivities[account.id]);

    const checkingActivities = Object.keys(accountActivities)
                                    .map(key => accounts[key])
                                    .filter((account: Account) => filterAccountByType(account, AccountType.CHECKING))
                                    .flatMap((account: Account) => accountActivities[account.id]);

    const cashActivities = Object.keys(accountActivities)
                                   .map(key => accounts[key])
                                   .filter((account: Account) => filterAccountByType(account, AccountType.CASH))
                                   .flatMap((account: Account) => accountActivities[account.id]);

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

    const total = checkingActivities.concat(cashActivities).concat(creditActivities);

    const reduceByCategory = (acc: any, current: any) => {
      if(current.amount) {
        const category = current.category || "Other";
        if(!acc[category]) {
          acc[category] = {
            amount: 0,
            currency: current.currency,
          }
        }
        acc[category].amount += current.amount;
      }

      return acc;
    }

    const thisMonthPerAccount: any = {
      [`${AccountType.CREDIT}`]: [],
      [`${AccountType.CHECKING}`]: [],
    }

    Object.keys(accountActivities)
          .map(key => accounts[key])
          .filter((account: Account) => [AccountType.CREDIT, AccountType.CHECKING].includes(account.type))
          .forEach((account: Account) => {
            const balance = accountActivities[account.id]
              .filter(tillNowFilter)
              .reduce(reducer, {amount:0, currency: Currency.EUR});
            thisMonthPerAccount[account.type].push({
              balance,
              ...account
            });
          });

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
        expenses: total.filter(filterByExpense).reduce(reducer, {amount:0, currency: Currency.EUR}),
        income: total.filter(filterByIncome).reduce(reducer, {amount:0, currency: Currency.EUR})
      },
      categorized: total.filter(filterByExpense).reduce(reduceByCategory, {}),
      accounts: thisMonthPerAccount,
    }

  }
}

export default new Bookkeeping();
