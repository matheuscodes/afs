import React from 'react';
import { connect } from "react-redux";
import LongTermService from '../../services/LongTermService';
import { Charge } from "../../models/Activity";
import DetailsTable from "./DetailsTable";
import UpkeepHistoryGraph from "./UpkeepHistoryGraph";
import {
  Tab,
  Tablist,
  Pane,
} from 'evergreen-ui'

const monthCalories = 30 * 2000;

class Upkeep extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUpkeeps()
  }

  render() {
    return <div>
      <h1>Upkeep</h1>
      <UpkeepHistoryGraph data={this.props.longTerm.upkeep} />
      {
        this.props.longTerm.upkeep ?
          <div>
            <DetailsTable
              title="Groceries"
              columns={{
                "Calories": (half: any) => <div>{half.groceries.reduce((sum: any, a:any) => a.calories + sum, 0)} kcal in Group</div>,
                "Price": (half: any) => <div>{half.groceries.reduce((sum: any, a:any) => a.price.amount + sum, 0).toFixed(2)} {half.groceries[0] ? half.groceries[0].price.currency : ''}</div>,
                "Multiplier": (half: any) => <div>{(monthCalories / half.groceries.reduce((sum: any, a:any) => a.calories + sum, 0)).toFixed(2)} groups needed / month</div>,
                "Budget": (half: any) => <strong>{(half.groceries.reduce((sum: any, a:any) => a.price.amount + sum, 0)*(monthCalories / half.groceries.reduce((sum: any, a:any) => a.calories + sum, 0))).toFixed(2)} {half.groceries[0] ? half.groceries[0].price.currency : ''}</strong>,
              }}
              data={this.props.longTerm.upkeep} />
            <DetailsTable
              title="Pet"
              columns={{
                "Food": (half: any) => <div>{(half.pet.food.amount).toFixed(2)} {half.pet.food.currency}</div>,
                "Taxes": (half: any) => <div>{(half.pet.taxes.amount).toFixed(2)} {half.pet.taxes.currency}</div>,
                "Vet": (half: any) => <div>{(half.pet.vet.amount).toFixed(2)} {half.pet.vet.currency}</div>,
                "Insurance": (half: any) => <div>{(half.pet.insurance.amount).toFixed(2)} {half.pet.insurance.currency}</div>,
                "Total": (half: any) => <strong>{
                  (half.pet.food.amount + half.pet.taxes.amount + half.pet.vet.amount + half.pet.insurance.amount).toFixed(2)
                } {half.pet.insurance.currency}</strong>,
              }}
              data={this.props.longTerm.upkeep} />
            <DetailsTable
              title="Housing"
              columns={{
                "Area": (half: any) => <div>{(half.housing.area)} m²</div>,
                "Cost": (half: any) => <div>{(half.housing.cost.amount).toFixed(2)} {half.housing.cost.currency}</div>,
                "Electricity": (half: any) => <div>{(half.housing.electricity.amount).toFixed(2)} {half.housing.electricity.currency}</div>,
                "Gas": (half: any) => <div>{(half.housing.gas.amount).toFixed(2)} {half.housing.gas.currency}</div>,
                "Internet": (half: any) => <div>{(half.housing.internet.amount).toFixed(2)} {half.housing.internet.currency}</div>,
                "Services": (half: any) => <div>{(half.housing.services.amount).toFixed(2)} {half.housing.services.currency}</div>,
                "Total": (half: any) => <strong>{
                  (half.housing.cost.amount + half.housing.electricity.amount + half.housing.gas.amount + half.housing.internet.amount + half.housing.services.amount).toFixed(2)
                } {half.housing.cost.currency}</strong>,
              }}
              data={this.props.longTerm.upkeep} />
            <DetailsTable
              title="Car"
              columns={{
                "Maintenance": (half: any) => half.car ? <div>{(half.car.maintenance.amount).toFixed(2)} {half.car.maintenance.currency}</div> : '',
                "Insurance": (half: any) => half.car ? <div>{(half.car.insurance.amount).toFixed(2)} {half.car.insurance.currency}</div> : '',
                "Fuel": (half: any) => half.car && half.car.fuel ? <div>{(half.car.fuel.amount).toFixed(2)} {half.car.fuel.currency}</div> : '',
                "Consumption": (half: any) => half.car && half.car.consumption ? <div>{(half.car.consumption).toFixed(2)} l/100km</div> : '',
                "Total": (half: any) => half.car && half.car.fuel ? <strong>{
                  (half.car.maintenance.amount + half.car.insurance.amount + ((2500/100)*half.car.consumption*half.car.fuel.amount)).toFixed(2)
                } {half.car.maintenance.currency}</strong> : (half.car && half.car.km ? <strong>{
                   (half.car.maintenance.amount + half.car.insurance.amount + (half.car.km*half.car.kmPrice.amount)).toFixed(2)
                 } {half.car.maintenance.currency}</strong> : ''),
              }}
              data={this.props.longTerm.upkeep} />

            <DetailsTable
              title="Income"
              columns={{
                "Salary": (half: any) => <div>{(half.salary.amount).toFixed(2)} {half.salary.currency}</div>,
                "Expected Savings": (half: any) => <div>{half.savings ? (half.savings.amount).toFixed(2) + ' ' + half.savings.currency : ''}</div>,
                "Disposable Income": (half: any) => <strong>{(half.salary.amount - (half.savings ? half.savings.amount : 0)).toFixed(2)} {half.salary.currency}</strong>,
              }}
              data={this.props.longTerm.upkeep} />
          </div> : ''
      }
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchUpkeeps: () => dispatch(LongTermService.loadUpkeeps())
});

export default connect(mapStateToProps, mapDispatchToProps)(Upkeep);
