import React from 'react';
import { connect } from "react-redux";
import CarFuelService from '../../services/CarFuelService';
import { Car, CarTankEntry, FuelUnit, Fuel } from '../../models/Car'
import { Table } from 'evergreen-ui'

const ColumnFlex = {
  date: 1,
  mileage: 1,
  tanked: 1,
  paid: 1,
  rest: 1,
  consumed: 1,
  traveled: 1,
  consumption: 1,
}

class CarFuel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    await this.props.fetchCars()
    await this.props.fetchTankEntries()
  }

  renderRow(tankEntry: CarTankEntry, index: number, traveled: number, level: number, consumed: number) {
    let consumptionperkm = undefined;
    let distanceperunit = undefined;
    if(traveled && consumed) {
      consumptionperkm = consumed / traveled;
      distanceperunit = traveled / consumed;
    }
    return <Table.Row key={index} height="auto">
      <Table.TextCell flex={ColumnFlex.date}>{tankEntry.date}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.mileage}>{tankEntry.mileage ? tankEntry.mileage + 'km' : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.tanked}>{`${tankEntry.tanked} ${FuelUnit[tankEntry.fuel]}`}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.paid}>{tankEntry.paid.amount + tankEntry.paid.currency}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.rest}>{level.toFixed(2)}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumed}>{consumed ? consumed.toFixed(2) + FuelUnit[tankEntry.fuel] : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.traveled}>{traveled ? traveled + 'km' : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{consumptionperkm ? (consumptionperkm * 100).toFixed(2) + FuelUnit[tankEntry.fuel] + '/100km' : '' }</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{distanceperunit ? distanceperunit.toFixed(2) + 'km/' + FuelUnit[tankEntry.fuel] : '' }</Table.TextCell>
    </Table.Row>
  }

  renderCar(car: Car) {
    let lastMileage = car.mileage;
    const tankLevel: Record<Fuel,number> = {} as Record<Fuel,number>;
    for(const fuel in Fuel) {
        const key = fuel as keyof typeof Fuel;
        tankLevel[Fuel[key]] = 0;
    }
    return <div>
      <p><strong>{car.name}</strong> - {car.mileage}km</p>
      <Table border>
        <Table.Head accountForScrollbar={false}>
          <Table.TextHeaderCell flex={ColumnFlex.date}>
            Date
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
            Mileage
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
            Tanked
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
            Paid
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
            Rest
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
            Consumed
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
            Traveled
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
            Consumption
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {car.tankEntries.map((entry, index) => {
            let traveled = undefined;
            if(entry.mileage) {
              traveled = entry.mileage - lastMileage;
              lastMileage = entry.mileage;
            }
            let consumed = undefined;
            if(entry.rest) {
              consumed = tankLevel[entry.fuel] - entry.rest;
              tankLevel[entry.fuel] = entry.rest + entry.tanked;
            } else {
              tankLevel[entry.fuel] += entry.tanked;
              if(tankLevel[entry.fuel] > car.tanks[entry.fuel]) {
                consumed = tankLevel[entry.fuel] - car.tanks[entry.fuel]
                tankLevel[entry.fuel] = car.tanks[entry.fuel]
              }
            }
            return this.renderRow(entry,index,traveled,tankLevel[entry.fuel], consumed)
          })}
        </Table.Body>
      </Table>
    </div>
  }

  render() {
    const cars = this.props.cars ?  Object.keys(this.props.cars).map(i => this.props.cars[i]) : []
    return <div>
      <h1>Car Fuel</h1>
      { cars.map(car => this.renderCar(car)) }
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchCars: () => dispatch(CarFuelService.fetchCars()),
  fetchTankEntries: () => dispatch(CarFuelService.fetchTankEntries())
});

export default connect(mapStateToProps, mapDispatchToProps)(CarFuel);
