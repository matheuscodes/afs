import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'evergreen-ui';
import AdvancedTable from './AdvancedTable';

function render() {
  console.log("Rendering...")
  ReactDOM.render(<div>
    <h2>Hello from React!</h2>
    <Button>I am using 🌲 Evergreen!</Button>
    <AdvancedTable />
    </div>, document.getElementById("internal-app"));
}

render();
