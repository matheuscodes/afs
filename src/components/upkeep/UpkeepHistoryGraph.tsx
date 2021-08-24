import React from 'react';
import { connect } from "react-redux";
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'
import React from 'react';
import { Line } from 'react-chartjs-2';

const label = {
  income: 0,
  housing: 1,
  pet: 2,
  groceries: 3,
}

const data = {
  labels: [],
  datasets: [
    {
      label: 'Income',
      data: [],
      fill: false,
      backgroundColor: 'rgb(0, 128, 0)',
      borderColor: 'rgba(0, 128, 0, 0.2)',
    },
    {
      label: 'Housing',
      data: [],
      fill: false,
      backgroundColor: 'rgb(128, 0, 0)',
      borderColor: 'rgba(128, 0, 0, 0.2)',
    },
    {
      label: 'Pet',
      data: [],
      fill: false,
      backgroundColor: 'rgb(0, 128, 128)',
      borderColor: 'rgba(0, 128, 128, 0.2)',
    },
    {
      label: 'Groceries',
      data: [],
      fill: false,
      backgroundColor: 'rgb(255, 128, 128)',
      borderColor: 'rgba(255, 128, 128, 0.2)',
    },
  ],
};

const options = {};

const monthCalories = 30 * 2000;

class DetailsTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  calculateReport() {
    const halfs = this.props.data;
    const filled = JSON.parse(JSON.stringify(data));
    if(!halfs || halfs.length <= 0) return filled;

    let firstGroceries, firstPet, firstHousing;
    let firstSalary = halfs[0].salary;
    halfs.forEach((half: any) => {
      const period = `${half.year}${half.period}`;
      filled.labels.push(period);

      let calories = 0, prices = 0;
      half.groceries.forEach((i: any) => {
        calories += i.calories;
        prices += i.price ? i.price.amount : 0;
      });
      const groceries = half.salary.amount / ((monthCalories / calories) * prices);
      if(!firstGroceries && Number.isFinite(groceries)) {
        firstGroceries = groceries;
        filled.datasets[label.groceries].data.push(1);
      } else {
        filled.datasets[label.groceries].data.push(groceries / firstGroceries);
      }

      const pet = half.salary.amount / (Object
        .keys(half.pet)
        .map((i: any) => half.pet[i].amount)
        .reduce((a: any, b:any) => a + b, 0) / 6);
      if(!firstPet && Number.isFinite(pet)) {
        firstPet = pet;
        filled.datasets[label.pet].data.push(1);
      } else {
        filled.datasets[label.pet].data.push(pet / firstPet);
      }

      const housing = half.salary.amount / (Object
        .keys(half.housing)
        .filter((i: index) => i !== 'area')
        .map((i: any) => half.housing[i].amount)
        .reduce((a: any, b:any) => a + b, 0) / half.housing.area);
      if(!firstHousing && Number.isFinite(housing)) {
        firstHousing = housing;
        filled.datasets[label.housing].data.push(1);
      } else {
        filled.datasets[label.housing].data.push(housing / firstHousing);
      }

      filled.datasets[label.income].data.push(half.salary.amount / firstSalary.amount);
    });

    return filled;
  }

  render() {
    const halfs = this.props.data;
    return <div>
      <div className='header'>
        <h2 className='title'>History</h2>
      </div>
      <Line data={this.calculateReport()} options={options} />
    </div>
  }
}

export default DetailsTable;
