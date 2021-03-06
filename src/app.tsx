import * as React from 'react';
import * as ReactDOM from 'react-dom';

function render() {
  console.log("Rendering...")
  ReactDOM.render(<h2>Hello from React!</h2>, document.getElementById("internal-app"));
}

render();
