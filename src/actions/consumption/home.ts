import { Home, HeatingMeasurement } from '../models/Home'

export const HOME_CONSUMPTION = "consumption/home";
export const UPDATE_HOMES = "update-homes";
export const UPDATE_HEATING_MEASUREMENTS = "update-heating-measurements";

export const updateHeatingMeasurements = (home: Home, measurements: HeatingMeasurement[]) => {
  return {
    type: HOME_CONSUMPTION,
    operation: UPDATE_HEATING_MEASUREMENTS,
    payload: {
      home,
      measurements,
    },
  }
}

export const updateHomes = (homes: Home[]) => {
  return {
    type: HOME_CONSUMPTION,
    operation: UPDATE_HOMES,
    payload: homes,
  }
}
