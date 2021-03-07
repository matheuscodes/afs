import React from 'react'
import { connect } from "react-redux";
import { addExpense } from "./actions/bookkeeping";
import { Expense, Currency } from "./models/Expense";
import ExpensesTable from './components/ExpensesTable'
import NewExpensesSheet from './components/NewExpensesSheet'
import BookkeepingService from './services/BookkeepingService'

class Application extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isShown: false,
    }
  }

  componentDidMount() {
    this.props.fetchExpenses()
  }

  render() {
    return <div>
      <NewExpensesSheet submitExpense={this.props.addExpense}/>
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
