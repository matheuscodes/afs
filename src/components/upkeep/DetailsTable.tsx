import React from 'react';
import { connect } from "react-redux";
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'

class DetailsTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderRow(half: any, index: number) {
    const period = `${half.year}${half.period}`;
    return <Table.Row key={`upkeep-detail-table-${index}`} height={'auto'}>
      <Table.TextCell flex={1}>{period}</Table.TextCell>
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
