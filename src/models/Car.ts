import { Charge } from './Activity'

export enum Fuel {
  DIESEL = "Diesel",
  GASOLINE = "Gasoline",
}

export interface Car {
  id: string,
  name: string,
  tanks: Record<string,number>,
  tankEntries: CarTankEntry[],
}

export interface CarTankEntry {
  carId: string,
  date: Date,
  mileage?: number,
  tanked: number,
  paid: Charge,
  fuel: Fuel,
  type?: string,
}
