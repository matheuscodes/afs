import React from 'react';
import { HashRouter,Link,Route,Switch } from "react-router-dom";
import Bookkeeping from "./components/Bookkeeping"
import CarFuel from "./components/consumption/CarFuel"
import WaterAndHeating from "./components/consumption/WaterAndHeating"
import Gas from "./components/consumption/Gas"
import Electricity from "./components/consumption/Electricity"
import Upkeep from "./components/upkeep"
import Savings from "./components/finances/Savings"
import PropertyInvestments from "./components/finances/investments/PropertyInvestments"

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
        <Route exact path="/finances/bookkeeping">
          <Bookkeeping />
        </Route>
        <Route exact path="/finances/savings">
          <Savings />
        </Route>
        <Route exact path="/finances/upkeep">
          <Upkeep />
        </Route>
        <Route exact path="/finances/investments/properties">
          <PropertyInvestments />
        </Route>
        <Route exact path="/home/heating">
          <WaterAndHeating />
        </Route>
        <Route exact path="/home/electricity">
          <Electricity />
        </Route>
        <Route exact path="/home/Gas">
          <Gas />
        </Route>
      </Switch>
    </HashRouter>
  }
}

export default Application;
