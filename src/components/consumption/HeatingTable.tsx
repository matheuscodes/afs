import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home, MeterMeasurement } from '../../models/Home'
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'

const ColumnFlex = {
  date: 1,
  measurement: 1,
}

class HeatingTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderRow(day: any, keyOrder: any[], index: number) {
    return <Table.Row key={`heating-table-${index}`} height={'auto'}>
      <Table.TextCell flex={ColumnFlex.date}>{day.date}</Table.TextCell>
      {keyOrder.map((key: any, index: number) =>
        <Table.TextCell key={`heating-table-cell-${index}`} flex={ColumnFlex.measurement}>{day[key]}</Table.TextCell>
      )}
    </Table.Row>
  }

  render() {
    const { heating } = this.props.data;
    const keys = Object.keys(heating.heaters);
    const report: any = {};
    if(heating && heating.heaters) {
      Object.keys(heating.heaters).forEach((key: string) => {
        if(heating.heaters[key].readings) {
          heating.heaters[key].readings.forEach((measurement: MeterMeasurement) => {
            if(!report[`${measurement.date}`]) {
              report[`${measurement.date}`] = {
                date: measurement.date,
              }
            }

            report[`${measurement.date}`][key] = measurement.measurement;
          });
        }
      })
    }
    return <Table border>
      <Table.Head accountForScrollbar={false} height='3em'>
        <Table.TextHeaderCell flex={ColumnFlex.date}>
          Date
        </Table.TextHeaderCell>
        { keys.map((key, index) =>
          <Table.TextHeaderCell key={`heating-measurement-${key}-${index}`} flex={ColumnFlex.measurement}>
            {heating.heaters[key].location} <br/>
            {heating.heaters[key].id}
          </Table.TextHeaderCell>
        )}
      </Table.Head>
      <Table.Body>
        {Object.keys(report).map((key: any, index: number) => this.renderRow(report[key], keys, index))}
      </Table.Body>
    </Table>
  }
}

export default HeatingTable;
