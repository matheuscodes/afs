import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home } from '../../models/Home'
import {
  Tab,
  Tablist,
  Pane,
} from 'evergreen-ui'

class WaterAndHeating extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    await this.props.fetchHomes()
  }

  render() {
    const homes = this.props.homes ?  Object.keys(this.props.homes).map(i => this.props.homes[i]) : []
    return <div>
      <h1>Water and Heating Costs</h1>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {homes.map((home: Home) => (
          <Tab
            key={home.id}
            onSelect={
              () => {
                this.props.fetchWater(home.id)
                this.props.fetchHeating(home.id)
                this.setState({...this.state, selectedHome: home})
              }
            }
            isSelected={this.state.selectedHome && home.id === this.state.selectedHome.id} >
            {home.name}
          </Tab>
        ))}
      </Tablist>
      {JSON.stringify(this.state.selectedHome)}
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchHomes: () => dispatch(HomeService.fetchHomes()),
  fetchWater: (homeId) => dispatch(HomeService.fetchWater(homeId)),
  fetchHeating: (homeId) => dispatch(HomeService.fetchHeating(homeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterAndHeating);
