import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home, WaterMeter, Heater } from '../../models/Home';
import WaterTable from './WaterTable'
import HeatingTable from './HeatingTable'
import { groupedPayments, dateDifference, getCurrentPrice } from '../../models/Bills';
import {
  Tab,
  Tablist,
  Pane,
} from 'evergreen-ui'

class WaterAndHeating extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    await this.props.fetchHomes()
  }

  getWaterReadings(waterMeter: WaterMeter, area: number): any[] {
    if(!waterMeter.measurements) return [];

    let lastDate: Date;
    let lastMeasurement: number;
    return waterMeter.measurements.map(measurement => {
      const item = {
        date: measurement.date,
        measurement: measurement.measurement,
        price: getCurrentPrice(measurement, waterMeter.prices),
        consumption: typeof lastMeasurement !== 'undefined' ? measurement.measurement - lastMeasurement : 0,
        days: lastDate ? dateDifference(measurement.date, lastDate) : 0,
        billable: measurement.billable
      }
      const cost = {
        amount: item.consumption * item.price.unit.amount + area * item.price.base.amount,
        currency: item.price.unit.currency,
      }

      lastMeasurement = measurement.measurement;
      lastDate = measurement.date;
      return {...item, cost};
    })
  }

  getHeaterReadings(heater: Heater, area: number): any[] {
    if(!heater.measurements) return [];

    let lastDate: Date;
    let lastMeasurement: number = 0;
    return heater.measurements.map(measurement => {
      const item = {
        date: measurement.date,
        measurement: measurement.measurement,
        price: getCurrentPrice(measurement, heater.prices),
        consumption: measurement.measurement - lastMeasurement,
        days: lastDate ? dateDifference(measurement.date, lastDate) : 0,
        billable: measurement.billable
      }
      const cost = {
        amount: item.consumption * item.price.unit.amount + area * item.price.base.amount,
        currency: item.price.unit.currency,
      }

      lastMeasurement = measurement.measurement;
      lastDate = measurement.date;
      return {...item, cost};
    })
  }

  getAllBills({water, heaters, area} : {water: {cold: WaterMeter, warm: WaterMeter}, heaters:  Record<string, Heater>, area: number}): any {
    const cold = this.getWaterBills(water.cold, area);
    const warm = this.getWaterBills(water.warm, area);
    const heating = this.getHeatingBills(heaters, area);
    return {
      cold,
      warm,
      heating,
    }
  }

  getHeatingBills(heaters: Record<string, Heater>, area: number): any {
    const heaterKeys = Object.keys(heaters);

    if(heaterKeys.length <= 0) return {
      heaters
    };

    const newHeaters = {};
    heaterKeys.forEach(key => {
      const heaterReadings = this.getHeaterReadings(heaters[key], area);
      const bills = this.getBills(heaters[key], area, heaterReadings);

      newHeaters[key] = {
        ...heaters[key],
        ...bills,
      }
    })

    return {
      heaters: newHeaters
    }
  }

  getWaterBills(waterMeter: WaterMeter, area: number): any {
    if(!waterMeter) return {};
    const waterReadings = this.getWaterReadings(waterMeter, area);

    return this.getBills(waterMeter, area, waterReadings);
  }

  getBills(meter: any, area: number, readings: any): any {
    if(!meter.payments) return {readings};
    const firstYear = readings ? new Date(readings.map(i => new Date(i.date)).sort((a,b) => a - b)[0]).getFullYear() : 0;
    const lastYear = readings ? new Date(readings.map(i => new Date(i.date)).sort((a,b) => b - a)[0]).getFullYear() : 0;
    const groups = []
    for (let i = firstYear; i <= lastYear; i++) {
      groups.push(i)
    }

    const all = [] as any[];
    let lastDate: string;
    let lastMeasurement: number;
    const bills = {};
    groups.forEach((year: any) => {
      let previousReading;
      let currentReading;
      readings
        .filter((reading, index) => reading.billable || index === (readings.length - 1))
        .filter(reading => new Date(reading.date).getFullYear() <= year)
        .forEach(reading => {
          if(new Date(reading.date).getFullYear() === year) {
            if(currentReading) {
              previousReading = currentReading;
            }
            currentReading = reading;
          } else {
            previousReading = reading;
          }
        });

      if(currentReading && previousReading) {
        const price = getCurrentPrice(currentReading, meter.prices);

        const item = {
          from: previousReading.date,
          to: currentReading.date,
          consumption: (currentReading.measurement - previousReading.measurement),
          days: dateDifference(currentReading.date, previousReading.date),
        }
        const unitCost = {
          amount: item.consumption * price.unit.amount,
          currency: price.unit.currency,
        }
        const baseCost = {
          amount: area * price.base.amount,
          currency: price.base.currency,
        }
        const totalCost = {
          amount: item.consumption * price.unit.amount + area * price.base.amount,
          currency: price.unit.currency,
        }

        bills[year] = {
          ...item,
          cost: {
            unit: unitCost,
            base: baseCost,
            total: totalCost,
          }
        }
      } else if(currentReading) {
        const price = getCurrentPrice(currentReading, meter.prices);

        const item = {
          from: null,
          to: currentReading.date,
          consumption: currentReading.measurement,
          days: 0,
        }
        const unitCost = {
          amount: item.consumption * price.unit.amount,
          currency: price.unit.currency,
        }
        const baseCost = {
          amount: area * price.base.amount,
          currency: price.base.currency,
        }
        const totalCost = {
          amount: item.consumption * price.unit.amount + area * price.base.amount,
          currency: price.unit.currency,
        }

        bills[year] = {
          ...item,
          cost: {
            unit: unitCost,
            base: baseCost,
            total: totalCost,
          }
        }
      }
    });

    return {
      readings,
      bills,
    };
  }

  getOverviews(allBills: any) {
    const base = {
      cost: {
        unit: {
          amount: 0,
        },
        base: {
          amount: 0,
        },
        total: {
          amount: 0
        }
      }
    }
    const yearly = {}
    if(allBills.cold && allBills.cold.bills) {
      Object.keys(allBills.cold.bills).forEach(year => {
        if(!yearly[year]) {
          yearly[year] = JSON.parse(JSON.stringify(base));
        }
        const bill = {cold: allBills.cold.bills[year]}
        yearly[year] = {...yearly[year], ...bill}
        yearly[year].cost.unit.amount += allBills.cold.bills[year].cost.unit.amount;
        yearly[year].cost.base.amount += allBills.cold.bills[year].cost.base.amount;
        yearly[year].cost.total.amount += allBills.cold.bills[year].cost.total.amount;
        yearly[year].cost.unit.currency = allBills.cold.bills[year].cost.unit.currency;
        yearly[year].cost.base.currency = allBills.cold.bills[year].cost.base.currency;
        yearly[year].cost.total.currency = allBills.cold.bills[year].cost.total.currency;
      });
    }
    if(allBills.warm && allBills.warm.bills) {
      Object.keys(allBills.warm.bills).forEach(year => {
        if(!yearly[year]) {
          yearly[year] = JSON.parse(JSON.stringify(base));
        }
        const bill = {warm: allBills.warm.bills[year]}
        yearly[year] = {...yearly[year], ...bill}
        yearly[year].cost.unit.amount += allBills.warm.bills[year].cost.unit.amount;
        yearly[year].cost.base.amount += allBills.warm.bills[year].cost.base.amount;
        yearly[year].cost.total.amount += allBills.warm.bills[year].cost.total.amount;
        yearly[year].cost.unit.currency = allBills.warm.bills[year].cost.unit.currency;
        yearly[year].cost.base.currency = allBills.warm.bills[year].cost.base.currency;
        yearly[year].cost.total.currency = allBills.warm.bills[year].cost.total.currency;
      });
    }
    if(allBills.heating && allBills.heating.heaters) {
      Object.keys(allBills.heating.heaters).forEach(heater => {
        if(allBills.heating.heaters[heater].bills) {
          Object.keys(allBills.heating.heaters[heater].bills).forEach(year => {
            if(!yearly[year]) {
              yearly[year] = JSON.parse(JSON.stringify(base));
            }
            if(!yearly[year].heaters) {
              yearly[year].heaters = []
            }
            yearly[year].heaters.push({
              ...allBills.heating.heaters[heater].bills[year],
              id: allBills.heating.heaters[heater].id,
              location: allBills.heating.heaters[heater].location,
            });
            yearly[year].cost.unit.amount += allBills.heating.heaters[heater].bills[year].cost.unit.amount;
            yearly[year].cost.base.amount += allBills.heating.heaters[heater].bills[year].cost.base.amount;
            yearly[year].cost.total.amount += allBills.heating.heaters[heater].bills[year].cost.total.amount;
            yearly[year].cost.unit.currency = allBills.heating.heaters[heater].bills[year].cost.unit.currency;
            yearly[year].cost.base.currency = allBills.heating.heaters[heater].bills[year].cost.base.currency;
            yearly[year].cost.total.currency = allBills.heating.heaters[heater].bills[year].cost.total.currency;
          });
        }
      });
    }

    return yearly;
  }

  render() {
    const homes = this.props.homes ?  Object.keys(this.props.homes).map(i => this.props.homes[i]) : []
    const allBills = this.state.selectedHome ? this.getAllBills(this.state.selectedHome) : undefined;
    const overviews = allBills ? this.getOverviews(allBills) : undefined;
    return <div>
      <h1>Water and Heating Costs</h1>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {homes.map((home: Home) => (
          <Tab
            key={home.id}
            onSelect={
              () => {
                this.props.fetchWater(home.id)
                this.props.fetchHeating(home.id)
                this.setState({...this.state, selectedHome: home})
              }
            }
            isSelected={this.state.selectedHome && home.id === this.state.selectedHome.id} >
            {home.name}
          </Tab>
        ))}
      </Tablist>
      {allBills ?
        <div>
          <h2>Water</h2>
          <WaterTable data={allBills} />
          <h2>Heating</h2>
          <HeatingTable data={allBills} />
        </div> : '' }
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchHomes: () => dispatch(HomeService.fetchHomes()),
  fetchWater: (homeId: string) => dispatch(HomeService.fetchWater(homeId)),
  fetchHeating: (homeId: string) => dispatch(HomeService.fetchHeating(homeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterAndHeating);
