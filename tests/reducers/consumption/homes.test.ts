import reducer from '../../../src/reducers/consumption/homes';
import {
  HOME_CONSUMPTION,
  UPDATE_HOMES,
  UPDATE_ELECTRICITY,
  UPDATE_GAS,
  UPDATE_WATER,
  UPDATE_HEATING,
} from '../../../src/actions/consumption/home';

describe('consumption/homes reducer', () => {
  test('UPDATE_HOMES merges homes into state', () => {
    const payload = [{ id: 'h1', name: 'Home1' }];
    const next = reducer({}, { type: HOME_CONSUMPTION, operation: UPDATE_HOMES, payload } as any);
    expect(next.h1).toBeDefined();
    expect(next.h1.name).toBe('Home1');
  });

  test('UPDATE_ELECTRICITY builds electricity structure per meter and assigns payments/measurements', () => {
    const homeId = 'h1';
    const initial: any = { h1: {} };
    const prices = [{ meter: 'm1', date: '2020-01-01' }];
    const payments = [{ meter: 'm1', amount: 10 }, { meter: 'other', amount: 5 }];
    const measurements = [{ meter: 'm1', value: 100 }];
    const actionPayload = { homeId, prices, payments, measurements };
    const next = reducer(initial, { type: HOME_CONSUMPTION, operation: UPDATE_ELECTRICITY, payload: actionPayload } as any);
    expect(next.h1.electricity).toBeTruthy();
    expect(next.h1.electricity.m1).toBeTruthy();
    expect(next.h1.electricity.m1.prices.length).toBe(1);
    expect(next.h1.electricity.m1.payments.every((p: any) => p.meter === 'm1')).toBe(true);
    expect(next.h1.electricity.m1.measurements.every((m: any) => m.meter === 'm1')).toBe(true);
  });

  test('UPDATE_GAS respects absence of gas and updates gas prices/payments when present', () => {
    const homeId = 'hG';
    const initial: any = { hG: { gas: { g1: {} } } };
    const prices = [{ meter: 'g1', date: '2020-01-01' }];
    const payments = [{ meter: 'g1', amount: 5 }];
    const measurements = [{ meter: 'g1', value: 1 }];
    const payload = { homeId, prices, payments, measurements };
    const next = reducer(initial, { type: HOME_CONSUMPTION, operation: UPDATE_GAS, payload } as any);
    expect(next.hG.gas.g1.prices.length).toBe(1);
    expect(next.hG.gas.g1.payments.every((p: any) => p.meter === 'g1')).toBe(true);
  });

  test('UPDATE_WATER assigns cold and warm meter data if water exists', () => {
    const homeId = 'hW';
    const initial: any = { hW: { water: { cold: { id: 'w1' }, warm: { id: 'w2' } } } };
    const prices = [{ meter: 'w1' }, { meter: 'w2' }];
    const payments = [{ meter: 'w1' }, { meter: 'w2' }];
    const measurements = [{ meter: 'w1' }, { meter: 'w2' }];
    const payload = { homeId, prices, payments, measurements };
    const next = reducer(initial, { type: HOME_CONSUMPTION, operation: UPDATE_WATER, payload } as any);
    expect(next.hW.water.cold.prices.length).toBeGreaterThanOrEqual(1);
    expect(next.hW.water.warm.prices.length).toBeGreaterThanOrEqual(1);
  });

  test('UPDATE_HEATING assigns heater prices/payments/measurements for existing heaters', () => {
    const homeId = 'hH';
    const initial: any = { hH: { heaters: { ht1: {} } } };
    const prices = [{ meter: 'ht1' }];
    const payments = [{ meter: 'ht1' }];
    const measurements = [{ meter: 'ht1' }];
    const payload = { homeId, prices, payments, measurements };
    const next = reducer(initial, { type: HOME_CONSUMPTION, operation: UPDATE_HEATING, payload } as any);
    expect(next.hH.heaters.ht1.prices.length).toBe(1);
    expect(next.hH.heaters.ht1.payments.every((p: any) => p.meter === 'ht1')).toBe(true);
  });
});