import React from 'react'
import {
  Pane,
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

export default class MonthlyActivityOverview extends React.Component<any, any> {
  render() {
    return (
      <Pane display='flex' width='100%'>
        <Pane padding={16} flex={2}>
          <Table border>
            <Table.Head accountForScrollbar={false}>
              <Table.TextHeaderCell textAlign="center">Overview</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
              <Table.Row intent='success' height='auto'>
                <Table.TextCell flex={3}><strong>Last Balance in Checking Accounts</strong></Table.TextCell>
                <Table.TextCell>{this.props.data ? `${this.props.data.lastMonth.checking.amount.toFixed(2)} ${this.props.data.lastMonth.checking.currency}` : '-'}</Table.TextCell>
              </Table.Row>
              <Table.Row height='auto'>
                <Table.TextCell flex={3}><strong>Last Balance in Credit Accounts</strong></Table.TextCell>
                <Table.TextCell>{this.props.data ? `${this.props.data.lastMonth.credit.amount.toFixed(2)} ${this.props.data.lastMonth.credit.currency}` : '-'}</Table.TextCell>
              </Table.Row>
              <Table.Row intent='success' height='auto'>
                <Table.TextCell flex={3}><strong>Last Balance in Cash</strong></Table.TextCell>
                <Table.TextCell>{this.props.data ? `${this.props.data.lastMonth.cash.amount.toFixed(2)} ${this.props.data.lastMonth.cash.currency}` : '-'}</Table.TextCell>
              </Table.Row>
              <Table.Row height='auto'>
                <Table.TextCell flex={3}><strong>Total Expenses</strong></Table.TextCell>
                <Table.TextCell>{this.props.data ? `${this.props.data.total.expenses.amount.toFixed(2)} ${this.props.data.total.expenses.currency}` : '-'}</Table.TextCell>
              </Table.Row>
              <Table.Row intent='success' height='auto'>
                <Table.TextCell flex={3}><strong>Total Income</strong></Table.TextCell>
                <Table.TextCell>{this.props.data ? `${this.props.data.total.income.amount.toFixed(2)} ${this.props.data.total.income.currency}` : '-'}</Table.TextCell>
              </Table.Row>
              <Table.Row height='auto'>
                <Table.TextCell flex={3}><strong>Checking Accounts Balance</strong></Table.TextCell>
                <Table.TextCell>{this.props.data ? `${this.props.data.current.checking.amount.toFixed(2)} ${this.props.data.current.checking.currency}` : '-'}</Table.TextCell>
              </Table.Row>
              <Table.Row intent='success' height='auto'>
                <Table.TextCell flex={3}><strong>Credit Balance</strong></Table.TextCell>
                <Table.TextCell>{this.props.data ? `${this.props.data.current.credit.amount.toFixed(2)} ${this.props.data.current.credit.currency}` : '-'}</Table.TextCell>
              </Table.Row>
              <Table.Row height='auto'>
                <Table.TextCell flex={3}><strong>Cash Balance</strong></Table.TextCell>
                <Table.TextCell>{this.props.data ? `${this.props.data.current.cash.amount.toFixed(2)} ${this.props.data.current.cash.currency}` : '-'}</Table.TextCell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Pane>
        {
          this.props.data.accounts ?
            Object.keys(this.props.data.accounts).map((accountType: string) =>
              <Pane padding={16} flex={1}>
                <Table border>
                  <Table.Head accountForScrollbar={false}>
                    <Table.TextHeaderCell textAlign="center">{`${accountType}`} Accounts</Table.TextHeaderCell>
                  </Table.Head>
                  <Table.Body>
                    {
                      this.props.data.accounts[accountType].map((account: any, index: number) =>
                        <Table.Row intent={index % 2 ? undefined : 'success'} height='auto'>
                          <Table.TextCell flex={2}><strong>{`${account.name}`}</strong></Table.TextCell>
                          <Table.TextCell>{`${account.balance.amount.toFixed(2)} ${account.balance.currency}`}</Table.TextCell>
                        </Table.Row>
                      )
                    }
                  </Table.Body>
                </Table>
              </Pane>
            )
          : ''
        }
      </Pane>
    )
  }
}
