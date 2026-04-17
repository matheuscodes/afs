import { legacy_createStore as createStore, applyMiddleware } from "redux";
import reducer from "./reducers";
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk))

function configureStore(state: any = {}) {
  return createStore(reducer, state, composedEnhancer);
}

export default configureStore;
