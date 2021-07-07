import React from 'react';
import { connect } from "react-redux";
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'

const ColumnFlex = {
  date: 1,
  ingredients: 1,
  overview: 1,
  basicFoodSum: 1,
  pet: {
    food: 1,
    taxes: 1,
    vet: 1,
    insurance: 1,
    total: 1,
  },
  housing: {
    area: 1,
    cost: 1,
    electricity: 1,
    gas: 1,
    internet: 1,
    services: 1,
    total: 1,
  },
  salary: 1,
}

const monthCalories = 30 * 2000;

class DetailsTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderRow(half: any, index: number) {
    const period = `${half.year}${half.period}`;
    return <Table.Row key={`upkeep-detail-table-${index}`} height={'auto'}>
      <Table.TextCell flex={ColumnFlex.date}>{period}</Table.TextCell>
      {this.groceriesOverview(half.groceries, period)}
      {this.petOverview(half.pet, period)}
      {this.housingOverview(half.housing, period)}
      <Table.TextCell flex={ColumnFlex.date}>
        <strong>
          {half.salary.amount.toFixed(2)} {half.salary.currency}
        </strong>
      </Table.TextCell>
    </Table.Row>
  }

  groceriesOverview(groceries: any[] = [], index: string) {
    let calories = 0, prices = 0;
    groceries.forEach((i: any) => {
      calories += i.calories;
      prices += i.price ? i.price.amount : 0;
    });
    return [
      <Table.TextCell key={`groceries-list-${index}`} flex={ColumnFlex.ingredients}>
        {groceries.map((i:any) => i.product).join(', ')}
      </Table.TextCell>,
      <Table.TextCell key={`groceries-overview-${index}`} flex={ColumnFlex.overview}>
        <div>{calories} kcal in Group</div>
        <div>{prices} {groceries[0].price ? groceries[0].price.currency : ''}</div>
        <div>{(monthCalories / calories).toFixed(2)} groups needed / month</div>
      </Table.TextCell>,
      <Table.TextCell key={`groceries-total-${index}`} flex={ColumnFlex.basicFoodSum}>
        <strong>
          {((monthCalories / calories) * prices).toFixed(2)}{' '}
          {groceries[0].price ? groceries[0].price.currency : ''}
        </strong>
      </Table.TextCell>,
    ]
  }

  petOverview(pet: any = {}, period: string) {
    let total = 0;
    let currency;
    return Object.keys(pet).map((i: any, index: number) => {
      total += pet[i].amount;
      currency = pet[i].currency;
      return <Table.TextCell key={`pet-overview-${period}-${index}`} flex={ColumnFlex.pet[i]}>
        {pet[i].amount} {pet[i].currency}
      </Table.TextCell>
    }).concat(
      <Table.TextCell key={`pet-overview-${period}-total`} flex={ColumnFlex.pet.total}>
        <strong>{total.toFixed(2)} {currency}</strong>
      </Table.TextCell>
    );
  }

  housingOverview(housing: any = {}, period: string) {
    let total = 0;
    let currency;
    return Object.keys(housing).filter((i: index) => i !== 'area').map((i: any, index: number) => {
      total += housing[i].amount;
      currency = housing[i].currency;
      console.log(i, housing[i], total)
      return <Table.TextCell key={`housing-overview-${period}-${index}`} flex={ColumnFlex.housing[i]}>
        {housing[i].amount} {housing[i].currency}
      </Table.TextCell>
    }).concat([
      <Table.TextCell key={`housing-overview-${period}-area`} flex={ColumnFlex.housing.area}>
        {housing.area} m²
      </Table.TextCell>,
      <Table.TextCell key={`housing-overview-${period}-total`} flex={ColumnFlex.housing.total}>
        <strong>{(total / housing.area).toFixed(2)} {currency}/m²</strong>
      </Table.TextCell>,
    ]);
  }

  render() {
    const halfs = this.props.data;
    return <Table border>
      <Table.Head accountForScrollbar={false}>
        <Table.TextHeaderCell flex={ColumnFlex.date}></Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.ingredients + ColumnFlex.overview + ColumnFlex.basicFoodSum}>
          Groceries
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.pet.food + ColumnFlex.pet.taxes + ColumnFlex.pet.vet + ColumnFlex.pet.insurance + ColumnFlex.pet.total}>
          Pet
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.housing.area + ColumnFlex.housing.cost + ColumnFlex.housing.electricity + ColumnFlex.housing.gas + ColumnFlex.housing.internet + ColumnFlex.housing.services + ColumnFlex.housing.total}>
          Housing
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.salary}></Table.TextHeaderCell>
      </Table.Head>
      <Table.Head accountForScrollbar={false}>
        <Table.TextHeaderCell flex={ColumnFlex.date}>
          Date
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.ingredients}>
          Ingredients
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.overview}>
          Overview
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.basicFoodSum}>
          Basic Food Sum
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.pet.food}>
          Food
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.pet.taxes}>
          Taxes
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.pet.vet}>
          Vet
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.pet.insurance}>
          Insurance
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.pet.total}>
          Pet Maintenance
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.housing.cost}>
          Cost
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.housing.electricity}>
          Electricity
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.housing.gas}>
          Gas
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.housing.internet}>
          Internet
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.housing.services}>
          Services
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.housing.area}>
          Area
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.housing.total}>
          Basic Living Sum/m²
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.salary}>
          Average Salary
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {halfs.map((i: any, index: number) => this.renderRow(i, index))}
      </Table.Body>
    </Table>
  }
}

export default DetailsTable;
