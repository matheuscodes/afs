import React from 'react';

class CarFuel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.loadData();
  }

  async loadData() {
    const data = await window.filesystem.readFile("consumption/cars.json");
    console.log("laaaaa", JSON.parse(data));
  }

  render() {
    return <div>
      <h1>Car Fuel</h1>
    </div>
  }
}

export default CarFuel;
