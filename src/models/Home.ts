export interface Heater {
  id: string,
  homeId: string,
  location: string,
  externalCode: string,
}

export interface HeaterMeasurement {
  heaterId: string,
  date: Date,
  measurement: number,
}

export interface Home {
  id: string,
  name: string,
  heaters: Heater[]
}
