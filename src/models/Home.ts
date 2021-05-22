import { Charge } from './Activity'

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

export interface GasMeter {
  payments?: MeterPayment[],
  prices: MeterPrice[],
  measurements?: MeterMeasurement[],
  combustion: number,
  condition: number,
  id: string,
}

export interface WaterMeter {
  payments?: MeterPayment[],
  prices: MeterPrice[],
  measurements?: MeterMeasurement[],
  id: string,
}

export interface Heater {
  id: string,
  homeId: string,
  location: string,
  factor: number,
  payments?: MeterPayment[],
  prices: MeterPrice[],
  measurements?: MeterMeasurement[],
  area?: number,
}


export interface Home {
  id: string,
  name: string,
  area: number,
  heaters?: Record<string, Heater>
  electricity?: Record<string, PowerMeter>,
  gas?: Record<string, GasMeter>,
  water: {
    warm: WaterMeter,
    cold: WaterMeter,
  }
}
