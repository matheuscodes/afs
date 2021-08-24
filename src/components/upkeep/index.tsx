import React from 'react';
import { connect } from "react-redux";
import LongTermService from '../../services/LongTermService';
import { Charge } from "../../models/Activity";
import DetailsTable from "./DetailsTable";
import UpkeepHistoryGraph from "./UpkeepHistoryGraph";
import {
  Tab,
  Tablist,
  Pane,
} from 'evergreen-ui'

class Upkeep extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUpkeeps()
  }

  render() {
    const wtf = this.props.longTerm.upkeep;
    return <div>
      <h1>Upkeep</h1>
      <UpkeepHistoryGraph data={this.props.longTerm.upkeep} />
      {
        this.props.longTerm.upkeep ?
          <DetailsTable data={this.props.longTerm.upkeep} /> : ''
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
