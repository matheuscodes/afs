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
            - (item.car || 0);
          filled.datasets[label.income].data.push(freeIncome);
          filled.datasets[label.housing].data.push(item.housing);
          filled.datasets[label.groceries].data.push(item.groceries);
          filled.datasets[label.pet].data.push(item.pet);
          filled.datasets[label.car].data.push(item.car);
        });
      });
    }
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
