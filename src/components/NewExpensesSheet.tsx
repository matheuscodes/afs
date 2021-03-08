import React from 'react'
import { Button, SideSheet, Heading, Paragraph, Pane, TextInputField, SelectField } from 'evergreen-ui'
import { Expense, Currency } from '../models/Expense'

function isFloat(n: any){
  return Number(n) === n && n % 1 !== 0;
}

function clone(obj: any) {
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
  isShown: boolean,
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
    this.setState({
      isShown: !this.state.isShown,
      expenses: this.state.expenses,
    });
  }

  addEmptyExpense() {
    this.state.expenses.push(clone(emptyExpense));
    this.setState(this.state);
  }

  submitExpenses() {
    this.state.expenses.forEach(expense => this.props.submitExpense(expense));
    this.setState({
      isShown: !this.state.isShown,
      expenses: [],
    });
  }

  render() {
    return (
      <Button margin={10} onClick={() => this.setState({ isShown: true })}>
        {"New Expenses"}
        <SideSheet
          isShown={this.state.isShown}
          onCloseComplete={() => this.toggleSideSheet()} >
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
                  onChange={(e: any) => {
                    expense.date = new Date(e.target.value);
                    this.setState(this.state);
                  }} />
                <TextInputField
                  padding={5}
                  isInvalid={!expense.source}
                  flex={3}
                  label="Source"
                  value={expense.source}
                  onChange={(e: any) => {
                    expense.source = e.target.value;
                    this.setState(this.state);
                  }} />
                <TextInputField
                  padding={5}
                  isInvalid={!expense.description}
                  flex={3}
                  label="Description"
                  value={expense.description}
                  onChange={(e: any) => {
                    expense.description = e.target.value;
                    this.setState(this.state);
                  }} />
                <TextInputField
                  padding={5}
                  isInvalid={isNaN(parseFloat(`${expense.value.amount}`))}
                  flex={1}
                  label="Amount"
                  value={expense.value.amount}
                  onChange={(e: any) => {
                    expense.value.amount = e.target.value;
                    this.setState(this.state);
                  }} />
                <SelectField
                  padding={5}
                  flex={1}
                  label="Currency"
                  value={expense.value.currency}
                  onChange={(e: any) => {
                    expense.value.currency = e.target.value as Currency;
                    this.setState(this.state);
                  }} >
                  {Object.keys(Currency).map(currency => <option key={currency} value={currency}>{currency}</option>)}
                </SelectField>
              </Pane>)}
          </Pane>
        </SideSheet>
      </Button>
    );
  }
}
