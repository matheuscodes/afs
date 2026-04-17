import React from 'react';
import { connect } from "react-redux";
import LongTermService from '../../services/LongTermService';
import DetailsTable from "./DetailsTable";
import UpkeepHistoryGraph from "./UpkeepHistoryGraph";

const monthCalories = 30 * 2000;

const renderAmount = (amount: number, currency: string) => <div>{amount.toFixed(2)} {currency}</div>;
const groceriesCalories = (half: any) => half.groceries.reduce((sum: any, a: any) => a.calories + sum, 0);
const groceriesPrice = (half: any) => half.groceries.reduce((sum: any, a: any) => (a.price?.amount || 0) + sum, 0);
const groceriesCurrency = (half: any) => half.groceries[0]?.price?.currency || '';
const groceriesMultiplier = (half: any) => {
  const calories = groceriesCalories(half);
  if (!calories) {
    return 0;
  }
  return monthCalories / calories;
};

const groceriesColumns = {
  Calories: (half: any) => <div>{groceriesCalories(half)} kcal in Group</div>,
  Price: (half: any) => <div>{groceriesPrice(half).toFixed(2)} {groceriesCurrency(half)}</div>,
  Multiplier: (half: any) => <div>{groceriesMultiplier(half).toFixed(2)} groups needed / month</div>,
  Budget: (half: any) => <strong>{(groceriesPrice(half) * groceriesMultiplier(half)).toFixed(2)} {groceriesCurrency(half)}</strong>,
};

const petColumns = {
  Food: (half: any) => renderAmount(half.pet.food.amount, half.pet.food.currency),
  Taxes: (half: any) => renderAmount(half.pet.taxes.amount, half.pet.taxes.currency),
  Vet: (half: any) => renderAmount(half.pet.vet.amount, half.pet.vet.currency),
  Insurance: (half: any) => renderAmount(half.pet.insurance.amount, half.pet.insurance.currency),
  Total: (half: any) => <strong>{(half.pet.food.amount + half.pet.taxes.amount + half.pet.vet.amount + half.pet.insurance.amount).toFixed(2)} {half.pet.insurance.currency}</strong>,
};

const housingColumns = {
  Area: (half: any) => <div>{half.housing.area} m²</div>,
  Cost: (half: any) => renderAmount(half.housing.cost.amount, half.housing.cost.currency),
  Electricity: (half: any) => renderAmount(half.housing.electricity.amount, half.housing.electricity.currency),
  Gas: (half: any) => renderAmount(half.housing.gas.amount, half.housing.gas.currency),
  Internet: (half: any) => renderAmount(half.housing.internet.amount, half.housing.internet.currency),
  Services: (half: any) => renderAmount(half.housing.services.amount, half.housing.services.currency),
  Total: (half: any) => <strong>{(half.housing.cost.amount + half.housing.electricity.amount + half.housing.gas.amount + half.housing.internet.amount + half.housing.services.amount).toFixed(2)} {half.housing.cost.currency}</strong>,
};

const carTotal = (half: any) => {
  if (!half.car) {
    return '';
  }
  if (half.car.fuel) {
    return <strong>{(half.car.maintenance.amount + half.car.insurance.amount + ((2500/100)*half.car.consumption*half.car.fuel.amount)).toFixed(2)} {half.car.maintenance.currency}</strong>;
  }
  if (half.car.km) {
    return <strong>{(half.car.maintenance.amount + half.car.insurance.amount + (half.car.km * half.car.kmPrice.amount)).toFixed(2)} {half.car.maintenance.currency}</strong>;
  }
  return '';
};

const carColumns = {
  Maintenance: (half: any) => half.car ? renderAmount(half.car.maintenance.amount, half.car.maintenance.currency) : '',
  Insurance: (half: any) => half.car ? renderAmount(half.car.insurance.amount, half.car.insurance.currency) : '',
  Fuel: (half: any) => half.car?.fuel ? renderAmount(half.car.fuel.amount, half.car.fuel.currency) : '',
  Consumption: (half: any) => half.car?.consumption ? <div>{half.car.consumption.toFixed(2)} l/100km</div> : '',
  Total: (half: any) => carTotal(half),
};

const incomeColumns = {
  Salary: (half: any) => renderAmount(half.salary.amount, half.salary.currency),
  "Expected Savings": (half: any) => <div>{half.savings ? `${half.savings.amount.toFixed(2)} ${half.savings.currency}` : ''}</div>,
  "Disposable Income": (half: any) => <strong>{(half.salary.amount - (half.savings?.amount || 0)).toFixed(2)} {half.salary.currency}</strong>,
};

class Upkeep extends React.Component<any, any> {
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
              columns={groceriesColumns}
              data={this.props.longTerm.upkeep} />
            <DetailsTable
              title="Pet"
              columns={petColumns}
              data={this.props.longTerm.upkeep} />
            <DetailsTable
              title="Housing"
              columns={housingColumns}
              data={this.props.longTerm.upkeep} />
            <DetailsTable
              title="Car"
              columns={carColumns}
              data={this.props.longTerm.upkeep} />

            <DetailsTable
              title="Income"
              columns={incomeColumns}
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
