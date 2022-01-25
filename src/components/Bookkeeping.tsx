import React from 'react';
import { connect } from "react-redux";
import { addActivity } from "../actions/bookkeeping";
import { Activity, Currency } from "../models/Activity";
import ActivitiesTable from '../components/ActivitiesTable'
import NewActivitiesSheet from '../components/NewActivitiesSheet'
import BookkeepingService from '../services/BookkeepingService'
import MonthlyActivityOverview from '../components/MonthlyActivityOverview'
import {
  Tab,
  Tablist,
  Pane,
} from 'evergreen-ui'

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

class Bookkeeping extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      year: new Date().getFullYear()
    }
  }

  componentDidMount() {
    this.props.fetchAccounts()
    this.props.fetchActivities()
  }

  availableMonths() {
    const months = this.props.bookkeeping
      .filter((i: any) => (i.date.getFullYear()) === this.state.year)
      .map((i: any) => i.date.getMonth())
      .map((i: any) => parseInt(i));
    return Array.from( new Set<number>(months) ).sort((a: number, b: number) => a - b);
  }

  availableYears() {
    const years = this.props.bookkeeping
      .map((i: any) => i.date.getFullYear())
      .sort();
    return Array.from( new Set<number>(years) )
  }

  render() {
    return <div>
      <h1>Bookkeeping</h1>
      <NewActivitiesSheet
        accounts={this.props.accounting.accounts}
        submitActivity={this.props.addActivity} />
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {this.availableYears().map((year: number) => (
          <Tab
            key={year}
            onSelect={() => this.setState({...this.state, year, month: undefined})}
            isSelected={year === this.state.year} >
            {year}
          </Tab>
        ))}
      </Tablist>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {this.availableMonths().map((month: number) => (
          <Tab
            key={month}
            onSelect={() => this.setState({...this.state, month})}
            isSelected={month === this.state.month}
          >
            {MONTHS[month]}
          </Tab>
        ))}
      </Tablist>
      {
        typeof this.state.month !== 'undefined' ?
        <Pane padding={16} flex={1}>
          <MonthlyActivityOverview
            data={BookkeepingService.monthlyOverview(
              this.state.year,
              this.state.month,
              this.props.bookkeeping,
              this.props.accounting.accounts
            )}/>
          <ActivitiesTable
            accounts={this.props.accounting.accounts}
            data={this.props.bookkeeping.filter((i: Activity) => {
              return i.date.getMonth() === this.state.month &&
                i.date.getFullYear() === this.state.year
            })} />
        </Pane> :
        ''
      }
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  addActivity: (activity: Activity) => dispatch(BookkeepingService.writeActivity(activity)),
  fetchActivities: () => dispatch(BookkeepingService.loadActivities()),
  fetchAccounts: () => dispatch(BookkeepingService.loadAccounts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Bookkeeping);
