import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home, GasMeter, MeterPayment, MeterPrice, MeterMeasurement } from '../../models/Home';
import { groupedPayments, dateDifference, getCurrentPrice } from '../../models/Bills';
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'

const ColumnFlex = {
  date: 1,
  measurement: 1,
  price: {
    unit: 1,
    base: 1,
  },
  consumption: 1,
  average: 1,
  days: 1,
  cost: 1,
}

class Gas extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    await this.props.fetchHomes()
  }

  getGasMeters(gasMeter: GasMeter): any[] {
    if(!gasMeter.measurements) return [];

    let lastDate: Date;
    let lastMeasurement: number;
    return gasMeter.measurements.map(measurement => {
      const item = {
        date: measurement.date,
        measurement: measurement.measurement,
        price: getCurrentPrice(measurement, gasMeter.prices),
        consumption: lastMeasurement ? measurement.measurement - lastMeasurement : 0,
        energy: lastMeasurement ? (measurement.measurement - lastMeasurement) * gasMeter.combustion * gasMeter.condition : 0,
        days: lastDate ? dateDifference(measurement.date, lastDate) : 0,
        billable: measurement.billable
      }
      const cost = {
        amount: item.consumption * gasMeter.combustion * gasMeter.condition * item.price.unit.amount + item.days * item.price.base.amount,
        currency: item.price.unit.currency,
      }

      lastMeasurement = measurement.measurement;
      lastDate = measurement.date;
      return {...item, cost};
    })
  }

  getBills(gasMeter: GasMeter): any[] {
    if(!gasMeter.payments) return [];

    const groups = groupedPayments(gasMeter.payments);
    const all = [] as any[];
    let lastDate: string;
    let lastMeasurement: number;
    let sumUnitCosts = 0;
    let sumBaseCosts = 0;
    this.getGasMeters(gasMeter).forEach((measurement,index) => {
      const price = getCurrentPrice(measurement, gasMeter.prices);
      sumUnitCosts += measurement.consumption * price.unit.amount * gasMeter.combustion * gasMeter.condition;
      sumBaseCosts += measurement.days * price.base.amount;
      if(measurement.billable || index === (gasMeter.measurements.length - 1)) {
        if(!lastMeasurement || !lastDate) {
          lastMeasurement = measurement.measurement;
          lastDate = measurement.date;
          return undefined;
        }
        const payments = groups.find(i => i.from < new Date(measurement.date) && i.to > new Date(measurement.date))
        const item = {
          from: lastDate,
          to: measurement.date,
          bill: measurement.bill,
          consumption: lastMeasurement ? (measurement.measurement - lastMeasurement) * gasMeter.combustion * gasMeter.condition : 0,
          days: lastDate ? dateDifference(measurement.date, lastDate) : 0,
          payments: payments,
        }
        const unitCost = {
          amount: sumUnitCosts,
          currency: price.unit.currency,
        }
        const baseCost = {
          amount: sumBaseCosts,
          currency: price.base.currency,
        }
        const totalCost = {
          amount: sumBaseCosts + sumUnitCosts,
          currency: price.unit.currency,
        }

        lastMeasurement = measurement.measurement;
        lastDate = measurement.date;
        sumUnitCosts = 0;
        sumBaseCosts = 0;
        all.push({...item, cost: {
          unit: unitCost,
          base: baseCost,
          total: totalCost,
        }});
      }
    })

    return all;
  }

  renderRow(measurementEntry: any, index: number) {
    return <Table.Row key={`electricity-${index}`} height={'auto'}>
      <Table.TextCell flex={ColumnFlex.date}>{measurementEntry.date}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.measurement}>{measurementEntry.measurement.toFixed(3)}m³</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{measurementEntry.days ? `${measurementEntry.consumption.toFixed(3)}m³` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{measurementEntry.days ? `${measurementEntry.energy.toFixed(1)}kWh` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.days}>{measurementEntry.days ? `${measurementEntry.days} days` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.average}>{measurementEntry.days ? `${(measurementEntry.consumption / measurementEntry.days).toFixed(3)}m³` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.price.unit}>{measurementEntry.days ? `${measurementEntry.price.unit.amount.toFixed(2) + measurementEntry.price.unit.currency}` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.price.base}>{measurementEntry.days ? `${measurementEntry.price.base.amount.toFixed(2) + measurementEntry.price.base.currency}` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.cost}>{measurementEntry.days ? `${measurementEntry.cost.amount.toFixed(2) + measurementEntry.cost.currency}` : ''}</Table.TextCell>
    </Table.Row>
  }

  render() {
    const homes = this.props.homes ?  Object.keys(this.props.homes).map(i => this.props.homes[i]) : []
    return <div>
      <h1>Gas</h1>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {homes.map((home: Home) => (
          <Tab
            key={home.id}
            onSelect={
              () => {
                this.props.fetchGas(home.id)
                this.setState({...this.state, selectedHome: home})
              }
            }
            isSelected={this.state.selectedHome && home.id === this.state.selectedHome.id} >
            {home.name}
          </Tab>
        ))}
      </Tablist>
      {
        this.state.selectedHome && this.state.selectedHome.gas ?
        Object.keys(this.state.selectedHome.gas).map(meter =>
          <div key={meter} >
            <h2>{meter}</h2>
            <div>
              {this.getBills(this.state.selectedHome.gas[meter]).map((bill,index) =>
                <Pane
                  key={`bill-${index}`}
                  elevation={2}
                  width={'46%'}
                  display={'inline-block'}
                  padding={12}
                  margin={'2%'}
                  justifyContent="center"
                  alignItems="center">
                  <Table border>
                    <Table.Head accountForScrollbar={false} height='3em'>
                      <Table.TextHeaderCell>
                        {bill.payments ? bill.payments.bill : "Current"}
                      </Table.TextHeaderCell>
                      {
                        bill.payments ?
                        <Table.TextHeaderCell>
                          <strong>Bill: </strong>
                          {(bill.cost.total.amount - bill.payments.sum.amount).toFixed(2) + bill.payments.sum.currency}
                        </Table.TextHeaderCell> : ''
                      }
                    </Table.Head>
                    <Table.Row height={'auto'}>
                      <Table.TextCell><strong>From:</strong> {bill.from}</Table.TextCell>
                      <Table.TextCell><strong>To:</strong> {bill.to}</Table.TextCell>
                    </Table.Row>
                    <Table.Row height={'auto'}>
                      <Table.TextCell><strong>Total Consumed</strong></Table.TextCell>
                      <Table.TextCell>{bill.consumption.toFixed(1)}kWh</Table.TextCell>
                    </Table.Row>
                    <Table.Row height={'auto'}>
                      <Table.TextCell><strong>Period</strong></Table.TextCell>
                      <Table.TextCell>{bill.days} days</Table.TextCell>
                    </Table.Row>
                    <Table.Row height={'auto'}>
                      <Table.TextCell><strong>Service costs</strong></Table.TextCell>
                      <Table.TextCell>{bill.cost.base.amount.toFixed(2) + bill.cost.base.currency}</Table.TextCell>
                    </Table.Row>
                    <Table.Row height={'auto'}>
                      <Table.TextCell><strong>Usage costs</strong></Table.TextCell>
                      <Table.TextCell>{bill.cost.unit.amount.toFixed(2) + bill.cost.unit.currency}</Table.TextCell>
                    </Table.Row>
                    <Table.Row height={'auto'}>
                      <Table.TextCell><strong>Total costs</strong></Table.TextCell>
                      <Table.TextCell>{bill.cost.total.amount.toFixed(2) + bill.cost.total.currency}</Table.TextCell>
                    </Table.Row>
                    { bill.payments ?
                      <Table.Row height={'auto'}>
                        <Table.TextCell><strong>Total payment</strong></Table.TextCell>
                        <Table.TextCell>{bill.payments.sum.amount.toFixed(2) + bill.payments.sum.currency}</Table.TextCell>
                      </Table.Row> : '' }
                  </Table>
                </Pane>
              )}
            </div>
            <Table border>
              <Table.Head accountForScrollbar={false} height='3em'>
                <Table.TextHeaderCell flex={ColumnFlex.date}>
                  Date
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={ColumnFlex.measurement}>
                  Reading
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={ColumnFlex.consumption}>
                  Consumption
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={ColumnFlex.consumption}>
                  Energy
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={ColumnFlex.days}>
                  Period
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={ColumnFlex.average}>
                  Consumption/day
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={ColumnFlex.price.unit}>
                  Price/kWh
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={ColumnFlex.price.base}>
                  Price/day
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={ColumnFlex.cost}>
                  Cost
                </Table.TextHeaderCell>
              </Table.Head>
              <Table.Body>
                {this.getGasMeters(this.state.selectedHome.gas[meter]).map(this.renderRow)}
              </Table.Body>
            </Table>
          </div>
        ): ''
      }
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchHomes: () => dispatch(HomeService.fetchHomes()),
  fetchGas: (homeId: string) => dispatch(HomeService.fetchGas(homeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Gas);
