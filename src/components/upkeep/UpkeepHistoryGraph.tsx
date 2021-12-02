import React from 'react';
import { connect } from "react-redux";
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui';
import { Line } from 'react-chartjs-2';
import LongTermService from '../../services/LongTermService';

const label = {
  income: 0,
  housing: 1,
  pet: 2,
  groceries: 3,
  car: 4,
  savings: 5,
}

const data: any = {
  labels: [],
  datasets: [
    {
      label: 'Disposable income',
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
    {
      label: 'Car',
      data: [],
      fill: false,
      backgroundColor: 'rgb(0, 0, 128)',
      borderColor: 'rgba(0, 0, 128, 0.2)',
    },
    {
      label: 'Savings',
      data: [],
      fill: false,
      backgroundColor: 'rgb(128, 0, 128)',
      borderColor: 'rgba(128, 0, 128, 0.2)',
    },
  ],
};

const options: any = {};

const monthCalories = 30 * 2000;

class DetailsTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  convertReport() {
    const converted = LongTermService.calculateUpkeepReport(this.props.data);
    const filled = JSON.parse(JSON.stringify(data));
    const forecast: any = {
      income: 0,
      housing: 0,
      groceries: 0,
      pet: 0,
      car: 0,
      savings: 0,
    }
    if(typeof converted.report !== 'undefined') {
      Object.keys(converted.report).forEach(year => {
        Object.keys(converted.report[year]).forEach(period => {
          const axis = `${year}${period}`;
          const item = converted.report[year][period];
          filled.labels.push(axis);
          const freeIncome = item.income
            - (item.housing || 0)
            - (item.groceries || 0)
            - (item.pet || 0)
            - (item.car || 0)
            - (item.savings || 0);
          filled.datasets[label.income].data.push(freeIncome);
          forecast.income = (forecast.income + (item.income || 0)) / 2;
          filled.datasets[label.housing].data.push(item.housing);
          forecast.housing = (forecast.housing + (item.housing || 0)) / 2;
          filled.datasets[label.groceries].data.push(item.groceries);
          forecast.groceries = (forecast.groceries + (item.groceries || 0)) / 2;
          filled.datasets[label.pet].data.push(item.pet);
          forecast.pet = (forecast.pet + (item.pet || 0)) / 2;
          filled.datasets[label.car].data.push(item.car);
          forecast.car = (forecast.car + (item.car || 0)) / 2;
          filled.datasets[label.savings].data.push(item.savings);
          forecast.savings = (forecast.savings + (item.savings || 0)) / 2;
        });
      });
    }

    filled.labels.push("Forecast");
    const freeIncomeForecast = forecast.income
      - (forecast.housing || 0)
      - (forecast.groceries || 0)
      - (forecast.pet || 0)
      - (forecast.car || 0)
      - (forecast.savings || 0);
    filled.datasets[label.income].data.push(freeIncomeForecast);
    filled.datasets[label.housing].data.push(forecast.housing);
    filled.datasets[label.groceries].data.push(forecast.groceries);
    filled.datasets[label.pet].data.push(forecast.pet);
    filled.datasets[label.car].data.push(forecast.car);
    filled.datasets[label.savings].data.push(forecast.savings);
    return filled;
  }

  render() {
    return <div>
      <div className='header'>
        <h2 className='title'>History</h2>
      </div>
      <Line data={this.convertReport()} options={options} type="line"/>
    </div>
  }
}

export default DetailsTable;
