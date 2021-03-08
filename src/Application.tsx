import React from 'react'
import { connect } from "react-redux";
import { addActivity } from "./actions/bookkeeping";
import { Activity, Currency } from "./models/Activity";
import ActivitiesTable from './components/ActivitiesTable'
import NewActivitiesSheet from './components/NewActivitiesSheet'
import BookkeepingService from './services/BookkeepingService'

class Application extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isShown: false,
    }
  }

  componentDidMount() {
    this.props.fetchActivities()
  }

  render() {
    return <div>
      <NewActivitiesSheet submitActivity={this.props.addActivity}/>
      <ActivitiesTable data={this.props.bookkeeping} />
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  addActivity: (activity: Activity) => dispatch(BookkeepingService.writeActivity(activity)),
  fetchActivities: (activity: Activity) => dispatch(BookkeepingService.loadActivities())
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
