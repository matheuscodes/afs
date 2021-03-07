import { createStore } from "redux";
import reducer from "./reducers";

function configureStore(state = { bookkeeping: [] }) {
  return createStore(reducer, state);
}

export default configureStore;
