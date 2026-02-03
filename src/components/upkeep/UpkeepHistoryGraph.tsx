import React from 'react';
import { connect } from "react-redux";
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
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

const options: any = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

const monthCalories = 30 * 2000;

class DetailsTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  convertReport(converted: any) {
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
          const amortization = new Date().getFullYear() - parseInt(year) + 1
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
          forecast.income = (amortization*forecast.income + (item.income || 0)) / (amortization + 1);
          filled.datasets[label.housing].data.push(item.housing);
          forecast.housing = (amortization*forecast.housing + (item.housing || 0)) / (amortization + 1);
          filled.datasets[label.groceries].data.push(item.groceries);
          forecast.groceries = (amortization*forecast.groceries + (item.groceries || 0)) / (amortization + 1);
          filled.datasets[label.pet].data.push(item.pet);
          forecast.pet = (amortization*forecast.pet + (item.pet || 0)) / (amortization + 1);
          filled.datasets[label.car].data.push(item.car);
          forecast.car = (amortization*forecast.car + (item.car || 0)) / (amortization + 1);
          filled.datasets[label.savings].data.push(item.savings);
          forecast.savings = (forecast.savings + (item.savings || 0) / amortization) / (amortization + 1);
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
    const converted = LongTermService.calculateUpkeepReport(this.props.data);
    console.log(converted)
    const years = []
    const thisYear = new Date().getFullYear()
    for(let i = 2010; i <= thisYear; i+=1) {
        years.push(i)
    }
    return <div>
      <div className='header'>
        <h2 className='title'>History</h2>
        {  converted.inflation ?
            <Table border>
              <Table.Body>

              <Table.Head accountForScrollbar={false}>
                <Table.TextHeaderCell>Metric</Table.TextHeaderCell>
                { years.map((i) => (<Table.TextHeaderCell>{i}</Table.TextHeaderCell>)) }
              </Table.Head>
                <Table.Row height={'auto'}>
                    <Table.TextCell>Income</Table.TextCell>
                    { years.map((i) => (<Table.TextCell>{converted.inflation[i]?.income ? converted.inflation[i].income.toFixed(2) + '%' : '-'}</Table.TextCell>)) }
                </Table.Row>
                <Table.Row height={'auto'}>
                    <Table.TextCell>Housing</Table.TextCell>
                    { years.map((i) => (<Table.TextCell>{converted.inflation[i]?.housing ? converted.inflation[i].housing.toFixed(2) + '%' : '-'}</Table.TextCell>)) }
                </Table.Row>
                <Table.Row height={'auto'}>
                    <Table.TextCell>Groceries</Table.TextCell>
                    { years.map((i) => (<Table.TextCell>{converted.inflation[i]?.groceries ? converted.inflation[i].groceries.toFixed(2) + '%' : '-'}</Table.TextCell>)) }
                </Table.Row>
                <Table.Row height={'auto'}>
                    <Table.TextCell>Pet</Table.TextCell>
                    { years.map((i) => (<Table.TextCell>{converted.inflation[i]?.pet ? converted.inflation[i].pet.toFixed(2) + '%' : '-'}</Table.TextCell>)) }
                </Table.Row>
                <Table.Row height={'auto'}>
                    <Table.TextCell>Car</Table.TextCell>
                    { years.map((i) => (<Table.TextCell>{converted.inflation[i]?.car ? converted.inflation[i].car.toFixed(2) + '%' : '-'}</Table.TextCell>)) }
                </Table.Row>
                <Table.Head accountForScrollbar={false}>
                    <Table.TextHeaderCell><strong>Total Inflation</strong></Table.TextHeaderCell>
                    { years.map((i) => (<Table.TextHeaderCell><strong>{converted.inflation[i]?.costs ? converted.inflation[i].costs.toFixed(2) + '%' : '-'}</strong></Table.TextHeaderCell>)) }
                </Table.Head>
              </Table.Body>
            </Table>
            : ""
        }
      </div>
      <Line data={this.convertReport(converted)} options={options} />
    </div>
  }
}

export default DetailsTable;
