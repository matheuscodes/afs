import React from 'react';
import { HashRouter,Link,Route,Switch } from "react-router-dom";
import Bookkeeping from "./components/Bookkeeping"
import CarFuel from "./components/consumption/CarFuel"

class Application extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <HashRouter>
      <Switch>
        <Route exact path="/">
          <p>Nothing</p>
        </Route>
        <Route exact path="/car/fuel">
          <CarFuel />
        </Route>
        <Route exact path="/bookkeeping">
          <Bookkeeping />
        </Route>
      </Switch>
    </HashRouter>
  }
}

export default Application;
