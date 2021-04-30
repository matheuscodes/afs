import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home, PowerMeter } from '../../models/Home'
import {
  Tab,
  Tablist,
  Pane,
  Table,
} from 'evergreen-ui'

function getCurrentPrice(measurement: MeterMeasurement, prices: MeterPrice[]) {
  return prices.find(i => i.date < measurement.date);
}

function dateDifference(a, b) {
  return (new Date(a) - new Date(b)) / (1000 * 60 * 60 * 24)
}

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

class Electricity extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    await this.props.fetchHomes()
  }

  getPowerMeters(powerMeter: PowerMeter): any[] {
    let lastDate;
    let lastMeasurement;
    return powerMeter.measurements.map(measurement => {
      const item = {
        date: measurement.date,
        measurement: measurement.measurement,
        price: getCurrentPrice(measurement, powerMeter.prices),
        consumption: lastMeasurement ? measurement.measurement - lastMeasurement : 0,
        days: lastDate ? dateDifference(measurement.date, lastDate) : 0,
      }
      const cost = {
        amount: item.consumption * item.price.unit.amount + item.days * item.price.unit.amount,
        currency: item.price.unit.currency,
      }

      lastMeasurement = measurement.measurement;
      lastDate = measurement.date;
      return {...item, cost};
    })
  }

  renderRow(measurementEntry: any, index: number) {
    return <Table.Row key={index} height={'auto'}>
      <Table.TextCell flex={ColumnFlex.date}>{measurementEntry.date}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.measurement}>{measurementEntry.measurement.toFixed(1)}kWh</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{measurementEntry.days ? `${measurementEntry.consumption.toFixed(1)}kWh` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.days}>{measurementEntry.days ? `${measurementEntry.days} days` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.average}>{measurementEntry.days ? `${(measurementEntry.consumption / measurementEntry.days).toFixed(1)}kWh` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.price.unit}>{measurementEntry.days ? `${measurementEntry.price.unit.amount.toFixed(2) + measurementEntry.price.unit.currency}` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.price.base}>{measurementEntry.days ? `${measurementEntry.price.base.amount.toFixed(2) + measurementEntry.price.base.currency}` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.cost}>{measurementEntry.days ? `${measurementEntry.cost.amount.toFixed(2) + measurementEntry.cost.currency}` : ''}</Table.TextCell>
    </Table.Row>
  }

  render() {
    const homes = this.props.homes ?  Object.keys(this.props.homes).map(i => this.props.homes[i]) : []
    return <div>
      <h1>Electricity</h1>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {homes.map((home: Home) => (
          <Tab
            key={home.id}
            onSelect={
              () => {
                this.props.fetchElectricity(home.id)
                this.setState({...this.state, selectedHome: home})
              }
            }
            isSelected={this.state.selectedHome && home.id === this.state.selectedHome.id} >
            {home.name}
          </Tab>
        ))}
      </Tablist>
      {
        this.state.selectedHome && this.state.selectedHome.electricity ?
        Object.keys(this.state.selectedHome.electricity).map(meter =>
          <Table key={meter} border>
            <Table.Head accountForScrollbar={false}>
              <Table.TextHeaderCell flex={ColumnFlex.date}>
                Date
              </Table.TextHeaderCell>
              <Table.TextHeaderCell flex={ColumnFlex.measurement}>
                Reading
              </Table.TextHeaderCell>
              <Table.TextHeaderCell flex={ColumnFlex.consumption}>
                Consumption
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
              {this.getPowerMeters(this.state.selectedHome.electricity[meter]).map(this.renderRow)}
            </Table.Body>
          </Table>
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
  fetchElectricity: (homeId) => dispatch(HomeService.fetchElectricity(homeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Electricity);
