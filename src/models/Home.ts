import { Charge } from './Activity'

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

export interface MeterMeasurement {
  meter: string,
  date: Date,
  measurement: number,
  billable?: boolean,
}

export interface MeterPrice {
  meter: string,
  date: Date,
  unit: Charge,
  base: Charge,
}

export interface MeterPayment {
  meter: string,
  date: Date,
  value: Charge,
  bill: string,
}

export interface PowerMeter {
  payments?: MeterPayment[],
  prices: MeterPrice[],
  measurements?: MeterMeasurement[],
}

export interface Home {
  id: string,
  name: string,
  heaters?: Heater[]
  electricity?: Record<string, PowerMeter>
}
