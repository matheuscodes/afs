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

const ColumnFlex = {
  date: 1,
  days: 1,
  measurement: 1,
  consumption: 1
}

class WaterTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderRow(day: any, index: number) {
    return <Table.Row key={`water-table-${index}`} height={'auto'}>
      <Table.TextCell flex={ColumnFlex.date}>{day.cold ? day.cold.date : day.warm.date}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.days}>{day.cold ? day.cold.days : day.warm.days} days</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.measurement}>{day.warm ? `${day.warm.measurement.toFixed(3)}m³` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.measurement}>{day.cold ? `${day.cold.measurement.toFixed(3)}m³` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{day.warm && day.warm.days ? `${(day.warm.consumption * 1000  / day.warm.days).toFixed(1)}l` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{day.cold && day.cold.days ? `${(day.cold.consumption * 1000 / day.cold.days).toFixed(1)}l` : ''}</Table.TextCell>
    </Table.Row>
  }

  render() {
    const {cold, warm} = this.props.data;
    const report = {};
    if(cold && cold.readings) {
      cold.readings.forEach(reading => {
        report[reading.date] = {
          cold: reading,
        }
      });
    }
    if(warm && warm.readings) {
      warm.readings.forEach(reading => {
        if(!report[reading.date]) report[reading.date] = {}
        report[reading.date].warm = reading;
      });
    }
    return <Table border>
      <Table.Head accountForScrollbar={false}>
        <Table.TextHeaderCell flex={ColumnFlex.date}>
          Date
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.days}>
          Days
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.measurement}>
          Reading warm
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.measurement}>
          Reading cold
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.consumption}>
          Warm per day
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex={ColumnFlex.consumption}>
          Cold per day
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {Object.keys(report).map((key, index) => this.renderRow(report[key], index))}
      </Table.Body>
    </Table>
  }
}

export default WaterTable;
