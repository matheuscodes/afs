import React from 'react';
import { HashRouter,Link,Route,Routes } from "react-router-dom";
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
      <Routes>
        <Route path="/" element={<p>Nothing</p>} />
        <Route path="/car/fuel" element={<CarFuel />} />
        <Route path="/finances/bookkeeping" element={<Bookkeeping />} />
        <Route path="/finances/savings" element={<Savings />} />
        <Route path="/finances/upkeep" element={<Upkeep />} />
        <Route path="/finances/investments/properties" element={<PropertyInvestments />} />
        <Route path="/home/heating" element={<WaterAndHeating />} />
        <Route path="/home/electricity" element={<Electricity />} />
        <Route path="/home/Gas" element={<Gas />} />
      </Routes>
    </HashRouter>
  }
}

export default Application;
