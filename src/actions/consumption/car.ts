import { Car, CarTankEntry } from '../models/Car'

export const CAR_CONSUMPTION = "consumption/car";
export const ADD_TANK_ENTRY = "add-tank-entry";
export const UPDATE_CARS = "update-cars";
export const UPDATE_CAR_TANK_ENTRIES = "update-car-tank-entries";

export const addTankEntry = (tankEntry: CarTankEntry) => {
  return {
    type: CAR_CONSUMPTION,
    operation: ADD_TANK_ENTRY,
    payload: tankEntry,
  }
}

export const updateCars = (cars: Car[]) => {
  return {
    type: CAR_CONSUMPTION,
    operation: UPDATE_CARS,
    payload: cars,
  }
}

export const updateTankEntries = (entries: CarTankEntry[]) => {
  return {
    type: CAR_CONSUMPTION,
    operation: UPDATE_CAR_TANK_ENTRIES,
    payload: entries,
  }
}
