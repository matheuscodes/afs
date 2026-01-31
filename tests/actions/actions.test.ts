import {
  LONG_TERM,
  LOAD_UPKEEPS,
  LOAD_SAVINGS,
  loadUpkeeps,
  loadSavings,
} from '../../src/actions/long-term';

import {
  ACCOUNTING,
  LOAD_ACCOUNTS,
  loadAccounts,
} from '../../src/actions/accounting';

import {
  CAR_CONSUMPTION,
  ADD_TANK_ENTRY,
  UPDATE_CARS,
  UPDATE_CAR_TANK_ENTRIES,
  addTankEntry,
  updateCars,
  updateTankEntries,
} from '../../src/actions/consumption/car';

import {
  HOME_CONSUMPTION,
  UPDATE_HOMES,
  UPDATE_ELECTRICITY,
  UPDATE_GAS,
  UPDATE_WATER,
  UPDATE_HEATING,
  UPDATE_HEATING_MEASUREMENTS,
  updateHeatingMeasurements,
  updateHomes,
  updateElectricity,
  updateGas,
  updateWater,
  updateHeating,
} from '../../src/actions/consumption/home';

import {
  INVESTMENT_PROPERTY,
  UPDATE_PROPERTIES,
  UPDATE_PROPERTY,
  updateProperties,
  updateProperty,
} from '../../src/actions/investments/property';

import {
  BOOKKEEPING,
  ADD_ACTIVITY,
  LOAD_ACTIVITIES,
  addActivity,
  loadActivities,
} from '../../src/actions/bookkeeping';

describe('actions (single-file tests)', () => {
  describe('long-term actions', () => {
    const origLog = console.log;
    beforeEach(() => { console.log = jest.fn(); });
    afterEach(() => { console.log = origLog; });

    test('loadUpkeeps returns LONG_TERM/LOAD_UPKEEPS action with payload', () => {
      const payload = [{ id: 'u1' }];
      const action = loadUpkeeps(payload);
      expect(action.type).toBe(LONG_TERM);
      expect(action.operation).toBe(LOAD_UPKEEPS);
      expect(action.payload).toBe(payload);
    });

    test('loadSavings returns LONG_TERM/LOAD_SAVINGS with payload', () => {
      const payload: any[] = [{ id: 's1' }];
      const action = loadSavings(payload);
      expect(action.type).toBe(LONG_TERM);
      expect(action.operation).toBe(LOAD_SAVINGS);
      expect(action.payload).toBe(payload);
    });
  });

  describe('accounting actions', () => {
    test('loadAccounts returns ACCOUNTING/LOAD_ACCOUNTS action', () => {
      const accounts = [{ id: 'a1' }];
      const action = loadAccounts(accounts as any);
      expect(action.type).toBe(ACCOUNTING);
      expect(action.operation).toBe(LOAD_ACCOUNTS);
      expect(action.payload).toBe(accounts);
    });
  });

  describe('consumption/car actions', () => {
    test('addTankEntry returns correct action', () => {
      const entry = { carId: 'c1', liters: 40 };
      const action = addTankEntry(entry as any);
      expect(action.type).toBe(CAR_CONSUMPTION);
      expect(action.operation).toBe(ADD_TANK_ENTRY);
      expect(action.payload).toBe(entry);
    });

    test('updateCars returns correct action', () => {
      const cars = [{ id: 'c1' }];
      const action = updateCars(cars as any);
      expect(action.type).toBe(CAR_CONSUMPTION);
      expect(action.operation).toBe(UPDATE_CARS);
      expect(action.payload).toBe(cars);
    });

    test('updateTankEntries returns correct action', () => {
      const entries = [{ carId: 'c1' }];
      const action = updateTankEntries(entries as any);
      expect(action.type).toBe(CAR_CONSUMPTION);
      expect(action.operation).toBe(UPDATE_CAR_TANK_ENTRIES);
      expect(action.payload).toBe(entries);
    });
  });

  describe('consumption/home actions', () => {
    test('updateHeatingMeasurements action structure', () => {
      const home = { id: 'h1' } as any;
      const measurements = [{ value: 1 }] as any;
      const action = updateHeatingMeasurements(home, measurements);
      expect(action.type).toBe(HOME_CONSUMPTION);
      expect(action.operation).toBe(UPDATE_HEATING_MEASUREMENTS);
      expect(action.payload).toEqual({ home, measurements });
    });

    test('updateHomes returns correct payload structure', () => {
      const homes = [{ id: 'h1' }] as any;
      const action = updateHomes(homes);
      expect(action.type).toBe(HOME_CONSUMPTION);
      expect(action.operation).toBe(UPDATE_HOMES);
      expect(action.payload).toBe(homes);
    });

    test('updateElectricity/gas/water/heating return expected payload nesting', () => {
      const homeId = 'hX';
      const measurements = [{ date: 'd' }] as any;
      const payments = [{ amount: 1 }] as any;
      const prices = [{ meter: 'm1' }] as any;

      const el = updateElectricity(homeId, measurements, payments, prices);
      expect(el.type).toBe(HOME_CONSUMPTION);
      expect(el.operation).toBe(UPDATE_ELECTRICITY);
      expect(el.payload).toEqual({ homeId, measurements, payments, prices });

      const g = updateGas(homeId, measurements, payments, prices);
      expect(g.type).toBe(HOME_CONSUMPTION);
      expect(g.operation).toBe(UPDATE_GAS);
      expect(g.payload).toEqual({ homeId, measurements, payments, prices });

      const w = updateWater(homeId, measurements, payments, prices);
      expect(w.type).toBe(HOME_CONSUMPTION);
      expect(w.operation).toBe(UPDATE_WATER);
      expect(w.payload).toEqual({ homeId, measurements, payments, prices });

      const h = updateHeating(homeId, measurements, payments, prices);
      expect(h.type).toBe(HOME_CONSUMPTION);
      expect(h.operation).toBe(UPDATE_HEATING);
      expect(h.payload).toEqual({ homeId, measurements, payments, prices });
    });
  });

  describe('investments/property actions', () => {
    test('updateProperties returns INVESTMENT_PROPERTY/UPDATE_PROPERTIES', () => {
      const props = [{ id: 'p1' }];
      const action = updateProperties(props);
      expect(action.type).toBe(INVESTMENT_PROPERTY);
      expect(action.operation).toBe(UPDATE_PROPERTIES);
      expect(action.payload).toBe(props);
    });

    test('updateProperty nests propertyId and valuations', () => {
      const valuations = [{ v: 1 }];
      const action = updateProperty('p1', valuations);
      expect(action.type).toBe(INVESTMENT_PROPERTY);
      expect(action.operation).toBe(UPDATE_PROPERTY);
      expect(action.payload).toEqual({ propertyId: 'p1', valuations });
    });
  });

  describe('bookkeeping actions', () => {
    test('addActivity returns BOOKKEEPING/ADD_ACTIVITY', () => {
      const act = { id: 'act1' } as any;
      const action = addActivity(act);
      expect(action.type).toBe(BOOKKEEPING);
      expect(action.operation).toBe(ADD_ACTIVITY);
      expect(action.payload).toBe(act);
    });

    test('loadActivities returns BOOKKEEPING/LOAD_ACTIVITIES', () => {
      const acts = [{ id: 'a1' }] as any;
      const action = loadActivities(acts);
      expect(action.type).toBe(BOOKKEEPING);
      expect(action.operation).toBe(LOAD_ACTIVITIES);
      expect(action.payload).toBe(acts);
    });
  });
});