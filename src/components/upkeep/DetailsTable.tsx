import React from 'react';
import { connect } from "react-redux";
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'

const ColumnFlex: any = {
  date: 1,
  ingredients: 1,
  overview: 1,
  basicFoodSum: 1,
  pet: {
    food: 1,
    taxes: 1,
    vet: 1,
    insurance: 1,
    total: 1,
  },
  housing: {
    area: 1,
    cost: 1,
    electricity: 1,
    gas: 1,
    internet: 1,
    services: 1,
    total: 1,
  },
  salary: 1,
}

const monthCalories = 30 * 2000;

class DetailsTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderRow(half: any, index: number) {
    const period = `${half.year}${half.period}`;
    return <Table.Row key={`upkeep-detail-table-${index}`} height={'auto'}>
      <Table.TextCell flex={ColumnFlex.date}>{period}</Table.TextCell>
      {
        Object.keys(this.props.columns).map(
          column =>
          <Table.TextCell key={`details-table-header-${column}`} flex={1}>
            {this.props.columns[column](half)}
          </Table.TextCell>
        )
      }
      {this.props.summary ? this.props.summary : ''}
    </Table.Row>
  }

  render() {
    const halfs = this.props.data;
    return <Table border>
      <Table.Head accountForScrollbar={false}>
        <Table.TextHeaderCell flex={Object.keys(this.props.columns).length + 1}>
          {this.props.title}
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Head accountForScrollbar={false}>
        <Table.TextHeaderCell flex={1}>
          Period
        </Table.TextHeaderCell>
        {
          Object.keys(this.props.columns).map(
            column =>
            <Table.TextHeaderCell key={`details-table-header-${column}`} flex={1}>
              {column}
            </Table.TextHeaderCell>
          )
        }
      </Table.Head>
      <Table.Body>
        {halfs.map((i: any, index: number) => this.renderRow(i, index))}
      </Table.Body>
    </Table>
  }
}

export default DetailsTable;
