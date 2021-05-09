import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home } from '../../models/Home'
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'

class WaterAndHeating extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <Table border>
      <Table.Head accountForScrollbar={false}>
        <Table.TextHeaderCell flex={ColumnFlex.date}>
          Date
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.measurement}>
          Reading warm
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.consumption}>
          Reading cold
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.consumption}>
          Warm per day
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.days}>
          Cold per day
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {this.getGasMeters(this.state.selectedHome.gas[meter]).map(this.renderRow)}
      </Table.Body>
    </Table>
  }
}

export default WaterAndHeating;
