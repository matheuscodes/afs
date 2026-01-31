import reducer from '../../../src/reducers/consumption/cars';
import { CAR_CONSUMPTION, UPDATE_CARS, UPDATE_CAR_TANK_ENTRIES } from '../../../src/actions/consumption/car';

describe('consumption/cars reducer', () => {
  test('UPDATE_CARS populates cars with empty tankEntries', () => {
    const carsPayload = [{ id: 'c1', name: 'Car1' }, { id: 'c2', name: 'Car2' }];
    const next = reducer({}, { type: CAR_CONSUMPTION, operation: UPDATE_CARS, payload: carsPayload } as any);
    expect(next.c1).toBeDefined();
    expect(Array.isArray(next.c1.tankEntries)).toBe(true);
    expect(next.c1.tankEntries.length).toBe(0);
    expect(next.c2.tankEntries.length).toBe(0);
  });

  test('UPDATE_CAR_TANK_ENTRIES appends entries to corresponding car', () => {
    const initial = {
      c1: { id: 'c1', tankEntries: [] as any[] },
    } as any;
    const entries = [{ carId: 'c1', liters: 40 }];
    const next = reducer(initial, { type: CAR_CONSUMPTION, operation: UPDATE_CAR_TANK_ENTRIES, payload: entries } as any);
    expect(next.c1.tankEntries).toBeDefined();
    expect(next.c1.tankEntries.length).toBe(1);
    expect(next.c1.tankEntries[0]).toEqual(entries[0]);
  });
});