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
    return <Table.Row key={`car-consumption-row-${index}`} height='auto'>
      <Table.TextCell>{`${tankEntry.date}`}</Table.TextCell>
      <Table.TextCell>{tankEntry.mileage ? tankEntry.mileage + 'km' : ''}</Table.TextCell>
      <Table.TextCell>{`${tankEntry.tanked} ${FuelUnit[tankEntry.fuel]}`}</Table.TextCell>
      <Table.TextCell>{tankEntry.paid.amount + tankEntry.paid.currency}</Table.TextCell>
      <Table.TextCell>{level.toFixed(2)}</Table.TextCell>
      <Table.TextCell>{consumed ? consumed.toFixed(2) + FuelUnit[tankEntry.fuel] : ''}</Table.TextCell>
      <Table.TextCell>{traveled ? traveled + 'km' : ''}</Table.TextCell>
      <Table.TextCell>{consumptionperkm ? (consumptionperkm * 100).toFixed(2) + FuelUnit[tankEntry.fuel] + '/100km' : '' }</Table.TextCell>
      <Table.TextCell>{distanceperunit ? distanceperunit.toFixed(2) + 'km/' + FuelUnit[tankEntry.fuel] : '' }</Table.TextCell>
    </Table.Row>
  }

  renderCar(car: Car, index: number) {
    let lastMileage = car.mileage;
    let totalTanked = 0;
    let totalPaid = 0;
    const tankLevel: Record<Fuel,number> = {} as Record<Fuel,number>;
    for(const fuel in Fuel) {
        const key = fuel as keyof typeof Fuel;
        tankLevel[Fuel[key]] = 0;
    }
    let pending: number[] = [];
    const rows = car.tankEntries.map((entry, index) => {
      let traveled = undefined;
      if(entry.mileage) {
        traveled = entry.mileage - lastMileage;
        lastMileage = entry.mileage;
      }
      let consumed = undefined;
      pending.push(entry.tanked);
      if(entry.mileage) {
        consumed = pending.reduce((a,b) => a+b, 0);
        tankLevel[entry.fuel] = car.tanks[entry.fuel]
        pending = [];
      }
      totalTanked += entry.tanked;
      totalPaid += entry.paid.amount;
      return this.renderRow(entry,index,traveled,tankLevel[entry.fuel], consumed)
    });
    const totalMileage = (lastMileage - car.mileage);
    return <div key={`car-consumption-${index}`}>
      <p><strong>{car.name}</strong> - {car.mileage}km</p>
      <p><strong>{totalTanked.toFixed(2)} l</strong> - {totalPaid.toFixed(2)} € / {totalMileage}km - <strong>{(totalTanked * 100 / totalMileage).toFixed(2)} l/100km</strong></p>
      <p><strong>{(totalTanked * 2.65).toFixed(2)} Kg CO² </strong> - {totalMileage*0.5} g CO, {totalMileage*0.09} g HC, {totalMileage*0.08} g NOx</p>
      <Table border>
        <Table.Head accountForScrollbar={false} height='3em'>
          <Table.TextHeaderCell>
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
        {
          rows
        }
        </Table.Body>
      </Table>
    </div>
  }

  render() {
    const cars = this.props.cars ?  Object.keys(this.props.cars).map(i => this.props.cars[i]) : []
    return <div>
      <h1>Car Fuel</h1>
      { cars.map((car: any, index: number) => this.renderCar(car, index)) }
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
