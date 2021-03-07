import React from 'react'
import { Button, SideSheet, Heading, Paragraph, Pane, TextInputField, SelectField } from 'evergreen-ui';
import { Expense, Currency } from "../models/Expense";

function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}

function clone(obj) {
  const copy = JSON.parse(JSON.stringify(obj));
  copy.date = new Date(copy.date);
  return copy;
}

const emptyExpense: any = {
  date: new Date(),
  source: "",
  description: "",
  value: {
    amount: 0,
    currency: Currency.EUR,
  },
}

interface NewExpensesSheetState {
  isShow: boolean,
  expenses: Expense[],
}

export default class NewExpensesSheet extends React.Component<any, NewExpensesSheetState> {
  constructor(props: any) {
    super(props);

    this.state = this.initialState();
  }

  initialState() {
    return {
      isShown: false,
      expenses: [clone(emptyExpense)]
    }
  }

  toggleSideSheet() {
    this.state.isShown = !this.state.isShown;
    this.setState(this.state);
  }

  addEmptyExpense() {
    this.state.expenses.push(clone(emptyExpense));
    this.setState(this.state);
  }

  submitExpenses() {
    this.state.expenses.forEach(expense => this.props.submitExpense(expense));
    this.state.expenses = [];
    this.setState(this.state);
  }

  render() {
    return (
      <Button margin={10} onClick={() => this.setState({ isShown: true })}>
        {"New Expenses"}
        <SideSheet
          isShown={this.state.isShown}
          onCloseComplete={() => this.setState({ isShown: false })} >
          <Pane margin={40}>
            <Heading margin={5} size={700} marginTop="default">New Expenses</Heading>
            <Button margin={5} onClick={() => this.addEmptyExpense()}>Add</Button>
            <Button margin={5} onClick={() => this.submitExpenses()}>Submit</Button>
            {this.state.expenses.map((expense, index) => <Pane key={index} display="flex">
                <TextInputField
                  padding={5}
                  isInvalid={isNaN(new Date(expense.date).getTime())}
                  flex={2}
                  label="Date"
                  value={expense.date.toJSON().substring(0,10)}
                  onChange={(e) => {
                    expense.date = new Date(e.target.value);
                    this.setState(this.state);
                  }} />
                <TextInputField
                  padding={5}
                  isInvalid={!expense.source}
                  flex={3}
                  label="Source"
                  value={expense.source}
                  onChange={(e) => {
                    expense.source = e.target.value;
                    this.setState(this.state);
                  }} />
                <TextInputField
                  padding={5}
                  isInvalid={!expense.description}
                  flex={3}
                  label="Description"
                  value={expense.description}
                  onChange={(e) => {
                    expense.description = e.target.value;
                    this.setState(this.state);
                  }} />
                <TextInputField
                  padding={5}
                  isInvalid={isNaN(parseFloat(expense.value.amount))}
                  flex={1}
                  label="Amount"
                  value={expense.value.amount}
                  onChange={(e) => {
                    expense.value.amount = e.target.value;
                    this.setState(this.state);
                  }} />
                <SelectField
                  padding={5}
                  flex={1}
                  label="Currency"
                  value={expense.value.currency}
                  onChange={(e) => {
                    expense.value.currency = e.target.value;
                    this.setState(this.state);
                  }} >
                  {Object.keys(Currency).map(currency => <option key={currency} value={Currency[currency]}>{Currency[currency]}</option>)}
                </SelectField>
              </Pane>)}
          </Pane>
        </SideSheet>
      </Button>
    );
  }
}
