import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home } from '../../models/Home'
import {
  Tab,
  Tablist,
  Pane,
} from 'evergreen-ui'

class Gas extends React.Component<any, any> {
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
      <h1>Gas</h1>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {homes.map((home: Home) => (
          <Tab
            key={home.id}
            onSelect={() => this.setState({...this.state, selectedHome: home})}
            isSelected={this.state.selectedHome && home.id === this.state.selectedHome.id} >
            {home.name}
          </Tab>
        ))}
      </Tablist>
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchHomes: () => dispatch(HomeService.fetchHomes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Gas);
