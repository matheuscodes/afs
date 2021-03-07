import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'evergreen-ui';
import Application from './Application';

import { Provider } from "react-redux";
import configureStore from "./store";

function render() {
  console.log("Rendering...")
  ReactDOM.render(<div>
    <h2>Hello from React!</h2>
    <Provider store={configureStore()}>
      <Application />
    </Provider>
    </div>, document.getElementById("internal-app"));
}

render();
