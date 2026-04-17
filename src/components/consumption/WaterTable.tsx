import React from 'react';
import {
  Table,
} from 'evergreen-ui'

const ColumnFlex = {
  date: 1,
  days: 1,
  measurement: 1,
  consumption: 1
}

class WaterTable extends React.Component<any, any> {
  renderRow(day: any, index: number) {
    return <Table.Row key={`water-table-${index}`} height={'auto'}>
      <Table.TextCell flex={ColumnFlex.date}>{day.cold?.date || day.warm?.date}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.days}>{day.cold?.days || day.warm?.days} days</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.measurement}>{day.warm ? `${day.warm.measurement.toFixed(3)}m³` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.measurement}>{day.cold ? `${day.cold.measurement.toFixed(3)}m³` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{day.warm?.days? ? `${(day.warm.consumption * 1000  / day.warm.days).toFixed(1)}l` : ''}</Table.TextCell>
      <Table.TextCell flex={ColumnFlex.consumption}>{day.cold?.days? ? `${(day.cold.consumption * 1000 / day.cold.days).toFixed(1)}l` : ''}</Table.TextCell>
    </Table.Row>
  }

  render() {
    const {cold, warm} = this.props.data;
    const report: any = {};
    if(cold?.readings) {
      cold.readings.forEach((reading: any) => {
        report[reading.date] = {
          cold: reading,
        }
      });
    }
    if(warm?.readings) {
      warm.readings.forEach((reading: any) => {
        if(!report[reading.date]) report[reading.date] = {}
        report[reading.date].warm = reading;
      });
    }
    return <Table border>
      <Table.Head accountForScrollbar={false} height='3em'>
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
        {Object.keys(report).map((key: any, index: number) => this.renderRow(report[key], index))}
      </Table.Body>
    </Table>
  }
}

export default WaterTable;
