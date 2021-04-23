import React from 'react';
import { connect } from "react-redux";
import CarFuelService from '../../services/CarFuelService';
import { CarTankEntry } from '../../models/Car'

class CarFuel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    await this.props.fetchCars()
    await this.props.fetchTankEntries()
  }

  render() {
    return <div>
      <h1>Car Fuel</h1>
      {JSON.stringify(this.props)}
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  tank: (tankEntry: CarTankEntry) => dispatch(CarFuelService.tank(tankEntry)),
  fetchCars: () => dispatch(CarFuelService.fetchCars()),
  fetchTankEntries: () => dispatch(CarFuelService.fetchTankEntries())
});

export default connect(mapStateToProps, mapDispatchToProps)(CarFuel);
