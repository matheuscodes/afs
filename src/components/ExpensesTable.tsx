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

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const Order = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC'
}

export default class ExpensesTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: '',
      orderedColumn: 1,
      ordering: Order.NONE,
      column2Show: 'email'
    }
  }

  sort = expenses => {
    const { ordering, orderedColumn } = this.state
    // Return if there's no ordering.
    if (ordering === Order.NONE) return expenses

    return expenses.sort((a, b) => {
      let aValue = a[orderedColumn]
      let bValue = b[orderedColumn]

      if(typeof aValue === 'object' && !(aValue instanceof Date)) {
        aValue = aValue.amount;
        bValue = bValue.amount;
      }

      // Support string comparison
      const sortTable = { true: 1, false: -1 }

      // Order ascending (Order.ASC)
      if (this.state.ordering === Order.ASC) {
        return aValue === bValue ? 0 : sortTable[aValue > bValue]
      }

      // Order descending (Order.DESC)
      return bValue === aValue ? 0 : sortTable[bValue > aValue]
    })
  }

  // Filter the profiles based on the name property.
  filter = profiles => {
    const searchQuery = this.state.searchQuery.trim()

    // If the searchQuery is empty, return the profiles as is.
    if (searchQuery.length === 0) return profiles

    return profiles.filter(profile => {
      // Use the filter from fuzzaldrin-plus to filter by name.
      const result = filter([profile.name], searchQuery)
      return result.length === 1
    })
  }

  getIconForOrder = order => {
    switch (order) {
      case Order.ASC:
        return ArrowUpIcon
      case Order.DESC:
        return ArrowDownIcon
      default:
        return CaretDownIcon
    }
  }

  handleFilterChange = value => {
    this.setState({ searchQuery: value })
  }

  renderSortableTableHeaderCell = (columnName, prettyName) => {
    return (
      <Table.TextHeaderCell>
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

  renderRow = ({ expense, index }) => {
    return (
      <Table.Row key={index}>
        <Table.TextCell>{`${expense.date.toJSON().slice(0,10)}`}</Table.TextCell>
        <Table.TextCell>{expense.source}</Table.TextCell>
        <Table.TextCell>{expense.description}</Table.TextCell>
        <Table.TextCell>{`${expense.value.amount} ${expense.value.currency}`}</Table.TextCell>
        <Table.Cell width={48} flex="none">
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
        <Table.Head>
          {this.renderSortableTableHeaderCell("date", "Date")}
          <Table.SearchHeaderCell
            onChange={this.handleFilterChange}
            value={this.state.searchQuery} />
          <Table.SearchHeaderCell
            onChange={this.handleFilterChange}
            value={this.state.searchQuery} />
          {this.renderSortableTableHeaderCell("value", "Amount")}
          <Table.HeaderCell width={48} flex="none" />
        </Table.Head>
        <Table.VirtualBody height={640}>
          {items.map((item, index) => this.renderRow({ expense: item, index }))}
        </Table.VirtualBody>
      </Table>
    )
  }
}
