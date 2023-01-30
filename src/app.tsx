import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'evergreen-ui';
import Application from './Application';

import { Provider } from "react-redux";
import configureStore from "./store";

function render() {
  console.log("Rendering...")
  createRoot(document.getElementById("internal-app"))
      .render(
        <Provider store={configureStore()}>
          <Application />
        </Provider>
      );
}

render();
