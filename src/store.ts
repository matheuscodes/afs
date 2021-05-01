import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers";
import { Currency } from './models/Activity'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

function configureStore(state: any = { bookkeeping: [], accounting: {}, cars: {} }) {
  return createStore(reducer, state, composedEnhancer);
}

export default configureStore;
