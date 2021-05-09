import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home, WaterMeter } from '../../models/Home';
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

  getWaterBills({water, area} : {water: {cold: WaterMeter, warm: WaterMeter}, area: number}): any[] {
    return {
      cold: this.getWaterBill(water.cold, area),
      warm: this.getWaterBill(water.warm, area),
    }
  }

  getWaterBill(waterMeter: WaterMeter, area: number): any[] {
    if(!waterMeter || !waterMeter.payments) return {};

    const groups = groupedPayments(waterMeter.payments);
    const waterReadings = this.getWaterReadings(waterMeter);
    const all = [] as any[];
    let lastDate: string;
    let lastMeasurement: number;
    waterReadings.forEach((reading,index) => {
      const price = getCurrentPrice(reading, waterMeter.prices);
      if(reading.billable || index === (waterMeter.measurements.length - 1)) {
        //TODO port this fix to other bills
        if(typeof lastMeasurement === 'undefined' || !lastDate) {
          lastMeasurement = reading.measurement;
          lastDate = reading.date;
          return undefined;
        }
        const payments = groups.find(i => i.from < new Date(reading.date) && i.to > new Date(reading.date))

        const item = {
          from: lastDate,
          to: reading.date,
          consumption: typeof lastMeasurement !== 'undefined' ? (reading.measurement - lastMeasurement) : 0,
          days: lastDate ? dateDifference(reading.date, lastDate) : 0,
          payments: payments,
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

        lastMeasurement = reading.measurement;
        lastDate = reading.date;
        all.push({...item, cost: {
          unit: unitCost,
          base: baseCost,
          total: totalCost,
        }});
      }
    })

    return {
      readings: waterReadings,
      bills: all,
    };
  }

  render() {
    const homes = this.props.homes ?  Object.keys(this.props.homes).map(i => this.props.homes[i]) : []
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
      {this.state.selectedHome ? JSON.stringify(this.getWaterBills(this.state.selectedHome)) : ''}
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchHomes: () => dispatch(HomeService.fetchHomes()),
  fetchWater: (homeId) => dispatch(HomeService.fetchWater(homeId)),
  fetchHeating: (homeId) => dispatch(HomeService.fetchHeating(homeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterAndHeating);
