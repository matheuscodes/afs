import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'evergreen-ui';
import Application from './Application';

import { Provider } from "react-redux";
import configureStore from "./store";

function render() {
  const rootElement = document.getElementById("internal-app");
  if (!rootElement) {
    return;
  }

  createRoot(rootElement).render(
    <Provider store={configureStore()}>
      <Application />
    </Provider>
  );
}

render();
