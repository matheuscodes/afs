import React from 'react'
import { connect } from "react-redux";
import { addExpense } from "./actions/bookkeeping";
import { Expense, Currency } from "./models/Expense";
import { Button } from 'evergreen-ui';
import ExpensesTable from './components/ExpensesTable'
import BookkeepingService from './services/BookkeepingService'

class Application extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchExpenses()
  }

  render() {
    return <div>
      <Button onClick={() => this.props.addExpense({
        date: new Date(),
        source: "Test",
        description: "TestD",
        value: {
          amount: Math.random(),
          currency: Currency.EUR
        },
      })}>Add Expense</Button>
      <ExpensesTable data={this.props.bookkeeping} />
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  addExpense: (expense: Expense) => dispatch(BookkeepingService.writeExpense(expense)),
  fetchExpenses: (expense: Expense) => dispatch(BookkeepingService.loadExpenses())
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
