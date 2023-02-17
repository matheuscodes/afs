import { loadUpkeeps, loadSavings } from '../actions/long-term';
import { parseActivities } from '../models/Activity';
import { parseAccounts } from '../models/Account';

function isNotEmpty(str: string) {
  return str &&  str.length > 0;
}

function parse(str: string) {
  return JSON.parse(str);
}

const monthCalories = 30 * 2000;
const halfKm = 2500;

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

  calculateUpkeepReport(upkeeps: any[]) {
    const halfs = upkeeps;
    const report: any = {}
    if(!halfs || halfs.length <= 0) return {};

    let firstGroceries: any, firstPet: any, firstHousing: any;
    let firstSalary = halfs[0].salary;
    let firstArea = halfs[0].housing.area;
    halfs.forEach((half: any) => {
      if(!report[`${half.year}`]) {
        report[`${half.year}`] = {}
      }
      if(!report[`${half.year}`][`${half.period}`]) {
        report[`${half.year}`][`${half.period}`] = {}
      }

      if(typeof half.salary !== 'undefined'){
        report[`${half.year}`][`${half.period}`].income =  half.salary.amount / firstSalary.amount;
      }

      if(typeof half.savings !== 'undefined'){
        report[`${half.year}`][`${half.period}`].savings =  half.savings.amount / firstSalary.amount;
      }

      let calories = 0, prices = 0;
      half.groceries.forEach((i: any) => {
        calories += i.calories;
        prices += i.price ? i.price.amount : 0;
      });
      const groceries = ((monthCalories / calories) * prices) * 4 /*approximates my budget*/
      report[`${half.year}`][`${half.period}`].groceries = groceries / firstSalary.amount;

      const pet = (Object
        .keys(half.pet)
        .map((i: any) => half.pet[i].amount)
        .reduce((a: any, b:any) => a + b, 0) / 6 /*months*/) / firstSalary.amount;
      if(pet > 0) {
        report[`${half.year}`][`${half.period}`].pet = pet;
      }

      report[`${half.year}`][`${half.period}`].area = half.housing.area / firstArea;

      const housing = (Object
        .keys(half.housing)
        .filter((i: any) => i !== 'area')
        .map((i: any) => half.housing[i].amount)
        .reduce((a: any, b:any) => a + b, 0) ) / firstSalary.amount;
      report[`${half.year}`][`${half.period}`].housing = housing;

      if(typeof half.car !== 'undefined') {
        const car = half.car.maintenance.amount + (halfKm / 100) * half.car.consumption * half.car.fuel.amount;
        if(car > 0) {
          report[`${half.year}`][`${half.period}`].car = (car / 6 /*months*/) / firstSalary.amount;
        }
      }

    });

    return {
      base: firstSalary,
      report
    };
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

      const bookkeeping = files.filter(isNotEmpty).map(parseActivities).flatMap((x:any) => x);

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
