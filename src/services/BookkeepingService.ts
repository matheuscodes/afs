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


type Categories = string;
type Data = {
  label: string;
  data: number[];
  backgroundColor: string;
}
type CategorizedData = {
  [key in Categories]: Data;
}

const categoryColor: {[key in string]: string} = {}

function getRandomColor(category: string): any {
    if(categoryColor[category]) return categoryColor[category];
    // Simple hash function (djb2)
    let hash = 5381;
    for (let i = 0; i < category.length; i++) {
        hash = (hash * 33) ^ category.charCodeAt(i);
    }

    // Convert hash to 6-digit hex
    const color = "#" + ((hash >>> 0) & 0xFFFFFF).toString(16).padStart(6, "0");

    categoryColor[category] = color;
    return color;
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
  yearlyOverview(activities: Activity[]): { [year: string]: CategorizedData } {
    const years = {}
    activities.reduce((report: any, current: Activity) => {
        const year = current.date.toJSON().substring(0,4);
        const month = parseInt(current.date.toJSON().substring(5,7)) - 1;
        if (!report[year]) {
            report[year] = {};
        }
        const category = current.category || 'Other';
        if (!report[year][category]) {
            report[year][category] = {
                label: category,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: getRandomColor(category),
            }
        }
        const data = report[year][category].data;
        if ((!current.transfer && current.value.amount < 0) || (current.transfer && category != 'Other')) {
            if(current.value.amount > -5000) {
                data[month] -= current.value.amount;
            }
        }
        return report;
    }, years)
    return years;
  }

  categoryOverview(report: CategorizedData = {}): any[] {
    return Object.values(report).map(a => ({
        label: a.label,
        data: [{x: a.label, y: (a.data || []).reduce((a,b) => a + b, 0)/(a.data || []).filter(a => a > 0).length}],
        backgroundColor: a.backgroundColor,
    }))
  }

  categorySources(activities: Activity[], year: string): any {
    const relevant = activities.filter(a => a.date.toJSON().startsWith(year));
    const categories: {[key in string]: any} = {}
    relevant.forEach((activity: Activity) => {
        const month = parseInt(activity.date.toJSON().substring(5,7)) - 1;
        const category = activity.category || 'Other';
        if(!categories[category]) {
            categories[category] = {}
        }
        if(!categories[category][activity.source]) {
           categories[category][activity.source] = {
              label: activity.source,
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              backgroundColor: getRandomColor(activity.source),
          }
        }
        const data = categories[category][activity.source].data;
        if ((!activity.transfer && activity.value.amount < 0) || (activity.transfer && category != 'Other')) {
            if(activity.value.amount > -5000) {
                data[month] -= activity.value.amount;
            }
        }
    });
    return categories;
  }

    categoryDescriptions(activities: Activity[], year: string): any {
      const relevant = activities.filter(a => a.date.toJSON().startsWith(year));
      const categories: {[key in string]: any} = {}
      relevant.forEach((activity: Activity) => {
          const month = parseInt(activity.date.toJSON().substring(5,7)) - 1;
          const category = activity.category || 'Other';
          if(!categories[category]) {
              categories[category] = {}
          }
          if(!categories[category][activity.description]) {
             categories[category][activity.description] = {
                label: activity.description,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: getRandomColor(activity.description),
            }
          }
          const data = categories[category][activity.description].data;
          if ((!activity.transfer && activity.value.amount < 0) || (activity.transfer && category != 'Other')) {
              if(activity.value.amount > -5000) {
                  data[month] -= activity.value.amount;
              }
          }
      });
      return categories;
    }
}

export default new Bookkeeping();
