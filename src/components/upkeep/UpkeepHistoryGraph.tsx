import React from 'react';
import {
  Table,
} from 'evergreen-ui';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  inflationCell(inflation: any, year: number, metric: string) {
    const metricValue = inflation[year]?.[metric];
    return metricValue ? `${metricValue.toFixed(2)}%` : '-';
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
    if(converted.report !== undefined) {
      Object.keys(converted.report).forEach(year => {
        Object.keys(converted.report[year]).forEach(period => {
          const amortization = new Date().getFullYear() - Number.parseInt(year, 10) + 1
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
                 { years.map((i) => (<Table.TextHeaderCell key={`upkeep-history-header-${i}`}>{i}</Table.TextHeaderCell>)) }
              </Table.Head>
                 <Table.Row height={'auto'}>
                     <Table.TextCell>Income</Table.TextCell>
                     { years.map((i) => (<Table.TextCell key={`upkeep-history-income-${i}`}>{this.inflationCell(converted.inflation, i, 'income')}</Table.TextCell>)) }
                 </Table.Row>
                 <Table.Row height={'auto'}>
                     <Table.TextCell>Housing</Table.TextCell>
                     { years.map((i) => (<Table.TextCell key={`upkeep-history-housing-${i}`}>{this.inflationCell(converted.inflation, i, 'housing')}</Table.TextCell>)) }
                 </Table.Row>
                 <Table.Row height={'auto'}>
                     <Table.TextCell>Groceries</Table.TextCell>
                     { years.map((i) => (<Table.TextCell key={`upkeep-history-groceries-${i}`}>{this.inflationCell(converted.inflation, i, 'groceries')}</Table.TextCell>)) }
                 </Table.Row>
                 <Table.Row height={'auto'}>
                     <Table.TextCell>Pet</Table.TextCell>
                     { years.map((i) => (<Table.TextCell key={`upkeep-history-pet-${i}`}>{this.inflationCell(converted.inflation, i, 'pet')}</Table.TextCell>)) }
                 </Table.Row>
                 <Table.Row height={'auto'}>
                     <Table.TextCell>Car</Table.TextCell>
                     { years.map((i) => (<Table.TextCell key={`upkeep-history-car-${i}`}>{this.inflationCell(converted.inflation, i, 'car')}</Table.TextCell>)) }
                 </Table.Row>
                 <Table.Head accountForScrollbar={false}>
                     <Table.TextHeaderCell><strong>Total Inflation</strong></Table.TextHeaderCell>
                     { years.map((i) => (<Table.TextHeaderCell key={`upkeep-history-total-${i}`}><strong>{this.inflationCell(converted.inflation, i, 'costs')}</strong></Table.TextHeaderCell>)) }
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
