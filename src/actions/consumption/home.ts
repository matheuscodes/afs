import { Home, MeterMeasurement, MeterPrice, MeterPayment } from '../../models/Home'

export const HOME_CONSUMPTION = "consumption/home";
export const UPDATE_HOMES = "update-homes";
export const UPDATE_ELECTRICITY = "update-electricity";
export const UPDATE_HEATING_MEASUREMENTS = "update-heating-measurements";

export const updateHeatingMeasurements = (home: Home, measurements: MeterMeasurement[]) => {
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

export const updateElectricity = (homeId: string, measurements: MeterMeasurement[], payments: MeterPayment[], prices: MeterPrice[]) => {
  return {
    type: HOME_CONSUMPTION,
    operation: UPDATE_ELECTRICITY,
    payload: {
      homeId,
      measurements,
      payments,
      prices,
    },
  }
}
