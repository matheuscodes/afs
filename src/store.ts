import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers";
import { Currency } from './models/Expense'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

function configureStore(state = { bookkeeping: [{
  date: new Date(),
  source: "Test",
  description: "TestD",
  value: {
    amount: Math.random(),
    currency: Currency.EUR
  },
}] }) {
  return createStore(reducer, state, composedEnhancer);
}

export default configureStore;
