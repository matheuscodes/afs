import { Charge } from './Activity'

export enum Fuel {
  DIESEL = "Diesel",
  GASOLINE = "Gasoline",
}

export const FuelUnit: Record<Fuel, string> = {
  [Fuel.DIESEL]: "l",
  [Fuel.GASOLINE]: "l",
}

export interface Car {
  id: string,
  name: string,
  tanks: Record<Fuel,number>,
  tankEntries: CarTankEntry[],
  mileage: number,
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
