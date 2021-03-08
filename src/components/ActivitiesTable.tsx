import React from 'react'
import { filter } from 'fuzzaldrin-plus'
import {
  Table,
  Popover,
  Position,
  Menu,
  Avatar,
  Text,
  IconButton,
  ArrowUpIcon,
  ArrowDownIcon,
  CaretDownIcon,
  MoreIcon,
  TextDropdownButton
} from 'evergreen-ui'

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

const Order = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC',
}

const ColumnFlex: any = {
  date: 1,
  source: 2,
  description: 4,
  value: 1,
}

export default class ActivitiesTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      searchQuery: {
        source: '',
        description: '',
      },
      orderedColumn: 1,
      ordering: Order.NONE,
      column2Show: 'email'
    }
  }

  sort = (activities: any) => {
    const { ordering, orderedColumn } = this.state
    // Return if there's no ordering.
    if (ordering === Order.NONE) return activities

    return activities.sort((a: any, b: any) => {
      let aValue = a[orderedColumn]
      let bValue = b[orderedColumn]

      if(typeof aValue === 'object' && !(aValue instanceof Date)) {
        aValue = aValue.amount;
        bValue = bValue.amount;
      }

      // Support string comparison
      const sortTable: any = { true: 1, false: -1 }

      // Order ascending (Order.ASC)
      if (this.state.ordering === Order.ASC) {
        return aValue === bValue ? 0 : sortTable[`${aValue > bValue}`]
      }

      // Order descending (Order.DESC)
      return bValue === aValue ? 0 : sortTable[`${bValue > aValue}`]
    })
  }

  filter = (activities: any) => {
    const sourceQuery = this.state.searchQuery.source.trim();
    const descriptionQuery = this.state.searchQuery.description.trim();

    if (sourceQuery.length === 0 && descriptionQuery.length === 0) return activities;

    return activities.filter((activity: any )=> {
      const sources = filter([activity.source], sourceQuery)
      return sourceQuery.length === 0 || sources.length === 1;
    }).filter((activity: any) => {
      const descriptions = filter([activity.description], descriptionQuery)
      return descriptionQuery.length === 0 || descriptions.length === 1;
    })
  }

  getIconForOrder = (order: any) => {
    switch (order) {
      case Order.ASC:
        return ArrowUpIcon
      case Order.DESC:
        return ArrowDownIcon
      default:
        return CaretDownIcon
    }
  }

  handleFilterChange = (value: string, parameter: string) => {
    this.state.searchQuery[parameter] = value;
    this.setState(this.state);
  }

  renderSortableTableHeaderCell = (columnName: string, prettyName: string) => {
    return (
      <Table.TextHeaderCell flex={ColumnFlex[columnName]}>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => (
            <Menu>
              <Menu.OptionsGroup
                title="Order"
                options={[
                  { label: 'Ascending', value: Order.ASC },
                  { label: 'Descending', value: Order.DESC }
                ]}
                selected={
                  this.state.orderedColumn === columnName ? this.state.ordering : null
                }
                onChange={value => {
                  this.setState({
                    orderedColumn: columnName,
                    ordering: value
                  })
                  // Close the popover when you select a value.
                  close()
                }}
              />
            </Menu>
          )}
        >
          <TextDropdownButton
            icon={
              this.state.orderedColumn === columnName
                ? this.getIconForOrder(this.state.ordering)
                : CaretDownIcon
            }>
            {prettyName}
          </TextDropdownButton>
        </Popover>
      </Table.TextHeaderCell>
    )
  }

  renderRowMenu = () => {
    return (
      <Menu>
        <Menu.Group>
          <Menu.Item>Share...</Menu.Item>
          <Menu.Item>Move...</Menu.Item>
          <Menu.Item>Rename...</Menu.Item>
        </Menu.Group>
        <Menu.Divider />
        <Menu.Group>
          <Menu.Item intent="danger">Delete...</Menu.Item>
        </Menu.Group>
      </Menu>
    )
  }

  renderRow = ({ activity, index }: { activity: any, index: number }) => {
    return (
      <Table.Row key={index} height="auto">
        <Table.TextCell flex={ColumnFlex.date}>{`${activity.date.toJSON().slice(0,10)}`}</Table.TextCell>
        <Table.TextCell flex={ColumnFlex.source}>{activity.source}</Table.TextCell>
        <Table.TextCell flex={ColumnFlex.description}>{activity.description}</Table.TextCell>
        <Table.TextCell flex={ColumnFlex.value}>{`${activity.value.amount} ${activity.value.currency}`}</Table.TextCell>
        <Table.Cell flex="none" width={48}>
          <Popover
            content={this.renderRowMenu}
            position={Position.BOTTOM_RIGHT} >
            <IconButton icon={MoreIcon} height={24} appearance="minimal" />
          </Popover>
        </Table.Cell>
      </Table.Row>
    )
  }

  render() {
    const items = this.filter(this.sort(this.props.data))
    return (
      <Table border>
        <Table.Head accountForScrollbar={false}>
          {this.renderSortableTableHeaderCell("date", "Date")}
          <Table.SearchHeaderCell
            flex={ColumnFlex.source}
            onChange={value => this.handleFilterChange(value, "source")}
            placeholder="Source"
            value={this.state.searchQuery.source} />
          <Table.SearchHeaderCell
            flex={ColumnFlex.description}
            onChange={value => this.handleFilterChange(value, "description")}
            placeholder="Description"
            value={this.state.searchQuery.description} />
          {this.renderSortableTableHeaderCell("value", "Amount")}
          <Table.HeaderCell flex="none" width={48}/>
        </Table.Head>
        <Table.Body>
          {items.map((item: any, index: number) => this.renderRow({ activity: item, index }))}
        </Table.Body>
      </Table>
    )
  }
}
