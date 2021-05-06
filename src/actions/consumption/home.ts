import { Home, MeterMeasurement, MeterPrice, MeterPayment } from '../../models/Home'

export const HOME_CONSUMPTION = "consumption/home";
export const UPDATE_HOMES = "update-homes";
export const UPDATE_ELECTRICITY = "update-electricity";
export const UPDATE_GAS = "update-gas";
export const UPDATE_WATER = "update-water";
export const UPDATE_HEATING = "update-heating";
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

export const updateGas = (homeId: string, measurements: MeterMeasurement[], payments: MeterPayment[], prices: MeterPrice[]) => {
  return {
    type: HOME_CONSUMPTION,
    operation: UPDATE_GAS,
    payload: {
      homeId,
      measurements,
      payments,
      prices,
    },
  }
}

export const updateWater = (homeId: string, measurements: MeterMeasurement[], payments: MeterPayment[], prices: MeterPrice[]) => {
  return {
    type: HOME_CONSUMPTION,
    operation: UPDATE_WATER,
    payload: {
      homeId,
      measurements,
      payments,
      prices,
    },
  }
}

export const updateHeating = (homeId: string, measurements: MeterMeasurement[], payments: MeterPayment[], prices: MeterPrice[]) => {
  return {
    type: HOME_CONSUMPTION,
    operation: UPDATE_HEATING,
    payload: {
      homeId,
      measurements,
      payments,
      prices,
    },
  }
}
