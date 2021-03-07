import { createStore } from "redux";
import reducer from "./reducers";
import { Currency } from './models/Expense'

function configureStore(state = { bookkeeping: [{
  date: new Date(),
  source: "Test",
  description: "TestD",
  value: {
    amount: Math.random(),
    currency: Currency.EUR
  },
}] }) {
  return createStore(reducer, state);
}

export default configureStore;
