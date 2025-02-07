import React from 'react';
import { connect } from "react-redux";
import BookkeepingService from '../../../services/BookkeepingService';
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDatasetProperties,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


class BookkeepingReports extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      year: new Date().getFullYear()
    }
  }

  componentDidMount() {
    this.props.fetchActivities()
  }

  calculateSummary(savings: any) {
    const summary: any = {};

    if(savings && savings.length) {
      savings.forEach((activity: any) => {
        if(activity.source && activity.source.type === 'Saving') {
          if(!summary[activity.source.id]) {
            summary[activity.source.id] = JSON.parse(JSON.stringify(activity.source));
            summary[activity.source.id].funds = {};
          }

          summary[activity.source.id].total =
            (summary[activity.source.id].total || 0) - activity.value.amount

          summary[activity.source.id].funds[activity.description] =
            (summary[activity.source.id].funds[activity.description] || 0) - activity.value.amount
        }

        if(activity.account && activity.account.type === 'Saving') {
          if(!summary[activity.account.id]) {
            summary[activity.account.id] = JSON.parse(JSON.stringify(activity.account));
            summary[activity.account.id].funds = {};
          }

          summary[activity.account.id].total =
            (summary[activity.account.id].total || 0) + activity.value.amount

          summary[activity.account.id].funds[activity.description] =
            (summary[activity.account.id].funds[activity.description] || 0) + activity.value.amount
        }
      });
    }

    const groupedByBank: any = {}
    Object.keys(summary).map(key => summary[key]).forEach((account: any) => {
      if(!groupedByBank[account.bank]) {
        groupedByBank[account.bank] = []
      }
      groupedByBank[account.bank].push(account);
    })
    return groupedByBank;
  }

  render() {
    const overviews = BookkeepingService.yearlyOverview(this.props.bookkeeping);

    const data = {
      labels,
      datasets: Object.values(overviews[this.state.year] || {}),
    };

    const datasets = BookkeepingService.categoryOverview(overviews[this.state.year] || {});
    const anotherData = {
      datasets,
    }


    const details = BookkeepingService.categorySources(this.props.bookkeeping, this.state.year);
    const sum = (a: any,b: any) => (a + b);
    const sorting = (a: any,b: any) => (b.data.reduce(sum, 0) - a.data.reduce(sum, 0));
    const other = Object.values(details['Other'] || {});
    other.sort(sorting);
    const otherData = {
      labels,
      datasets: other,
    };
    const base = Object.values(details['Base'] || {});
    base.sort(sorting);
    const baseData = {
      labels,
      datasets: base,
    };
    const disposable = Object.values(details['Disposable'] || {});
    disposable.sort(sorting);
    const disposableData = {
      labels,
      datasets: disposable,
    };

    return <div>
        <h1>Reports</h1>
        <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
          {Object.keys(overviews).map((year: string) => (
            <Tab
              key={year}
              onSelect={() => this.setState({...this.state, year})}
              isSelected={year === this.state.year} >
              {year}
            </Tab>
          ))}
        </Tablist>
        <Pane padding={16} flex={1}>

            <h3>Monthly expenditure</h3>
            <Bar options={options} data={data} />
            <h3>Category Averages</h3>
            <Bar options={options} data={anotherData} />
            <h3>Uncategorized expenditure</h3>
            <Bar options={options} data={otherData} />
            <h3>Disposable expenses</h3>
            <Bar options={options} data={disposableData} />
            <h3>Base expenses</h3>
            <Bar options={options} data={baseData} />
        </Pane>
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchActivities: () => dispatch(BookkeepingService.loadActivities()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookkeepingReports);
