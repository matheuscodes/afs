import { loadUpkeeps, loadSavings } from '../actions/long-term';
import { parseActivities } from '../models/Activity';
import { parseAccounts } from '../models/Account';

function isNotEmpty(str: string) {
  return !!str && str.trim().length > 0;
}

function parse(str: string) {
  return JSON.parse(str);
}

const monthCalories = 30 * 2000;
const halfKm = 2500;

type InflationYearMetrics = Record<string, number>;
type InflationMap = Record<number | string, InflationYearMetrics>;

function calculateCarCosts(car: any, halfKmValue: number) {
  if (!car) {
    return 0;
  }
  if (car.consumption) {
    return car.maintenance.amount + (halfKmValue / 100) * car.consumption * car.fuel.amount + (car.loan ? car.loan.amount : 0);
  }
  if (car.km) {
    return car.maintenance.amount + (car.km * car.kmPrice.amount) + (car.loan ? car.loan.amount : 0);
  }
  return 0;
}

function buildPeriodMetrics(half: any, firstSalaryAmount: number, firstArea: number, monthCaloriesValue: number, halfKmValue: number) {
  const periodMetrics: Record<string, number> = {};

  if(half.salary !== undefined){
    periodMetrics.income = half.salary.amount / firstSalaryAmount;
  }

  if(half.savings !== undefined){
    periodMetrics.savings = half.savings.amount / firstSalaryAmount;
  }

  let calories = 0;
  let prices = 0;
  half.groceries.forEach((item: any) => {
    calories += item.calories;
    prices += item.price ? item.price.amount : 0;
  });
  const groceries = ((monthCaloriesValue / calories) * prices) * 4;
  periodMetrics.groceries = groceries / firstSalaryAmount;

  const pet = (Object
    .keys(half.pet)
    .map((key: any) => half.pet[key].amount)
    .reduce((a: any, b:any) => a + b, 0) / 6) / firstSalaryAmount;
  if(pet > 0) {
    periodMetrics.pet = pet;
  }

  periodMetrics.area = half.housing.area / firstArea;

  const housing = Object
    .keys(half.housing)
    .filter((i: any) => i !== 'area')
    .map((i: any) => half.housing[i].amount)
    .reduce((a: any, b:any) => a + b, 0) / firstSalaryAmount;
  periodMetrics.housing = housing;

  const car = calculateCarCosts(half.car, halfKmValue);
  if(car > 0) {
    periodMetrics.car = (car / 6) / firstSalaryAmount;
  }

  return periodMetrics;
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

  calculateUpkeepReport(upkeeps: any[]) {
    const halfs = upkeeps;
    const report: any = {}
    if(!halfs || halfs.length <= 0) return {};

    const firstSalary = halfs[0].salary;
    const firstArea = halfs[0].housing.area;
    halfs.forEach((half: any) => {
      if(!report[`${half.year}`]) {
        report[`${half.year}`] = {}
      }
      report[`${half.year}`][`${half.period}`] = buildPeriodMetrics(half, firstSalary.amount, firstArea, monthCalories, halfKm);
    });
    const inflation: InflationMap = {
    }
    Object.keys(report).forEach(year => {
        if(!inflation[year]) {
            inflation[year] = {}
        }
        Object.keys(report[year]).forEach(period => {
            Object.keys(report[year][period]).forEach(metric => {
                if(!inflation[year][metric]) {
                    inflation[year][metric] = 0
                }
                inflation[year][metric] += (report[year][period][metric] / 2)
            })
            inflation[year]["costs"] = (inflation[year].housing || 0) + (inflation[year].groceries || 0) + (inflation[year].pet || 0) + (inflation[year].car || 0)
        })
    })

    const thisYear = new Date().getFullYear()
    for(let year = thisYear; year > 2009; year -= 1) {
        Object.keys(inflation[year]).forEach(metric => {
            if((inflation[year-1]?.[metric] || 0) > 0) {
                inflation[year][metric] = (inflation[year][metric] || 0) / (inflation[year-1]?.[metric] || 0)
            } else if (inflation[year][metric] > 0) {
                inflation[year][metric] = 100000
            } else {
                inflation[year][metric] = 0
            }

            inflation[year][metric] = (inflation[year][metric] - 1) * 100
        })
    }
    delete inflation["2009"]
    return {
      base: firstSalary,
      report,
      inflation,
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

      const bookkeeping = files.filter(isNotEmpty).map(parseActivities).flat();

      const savings = bookkeeping.map((activity: any) => {
        activity.source = accounts[activity.source];
        activity.account = accounts[activity.account];
        return activity;
      }).filter((activity: any) => activity.account?.type === 'Saving' || activity.source?.type === 'Saving')

      dispatch(loadSavings(savings))
    }
  }
}

export default new LongTermService();
