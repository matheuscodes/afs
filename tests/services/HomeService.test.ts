import HomeService from '../../src/services/HomeService';

jest.mock('../../src/actions/consumption/home', () => ({
  updateHomes: jest.fn((homes: any[]) => ({ type: 'UPDATE_HOMES', payload: homes })),
  updateElectricity: jest.fn((homeId: string, measurements: any[], payments: any[], prices: any[]) => ({
    type: 'UPDATE_ELECTRICITY',
    payload: { homeId, measurements, payments, prices },
  })),
  updateGas: jest.fn((homeId: string, measurements: any[], payments: any[], prices: any[]) => ({
    type: 'UPDATE_GAS',
    payload: { homeId, measurements, payments, prices },
  })),
  updateWater: jest.fn((homeId: string, measurements: any[], payments: any[], prices: any[]) => ({
    type: 'UPDATE_WATER',
    payload: { homeId, measurements, payments, prices },
  })),
  updateHeating: jest.fn((homeId: string, measurements: any[], payments: any[], prices: any[]) => ({
    type: 'UPDATE_HEATING',
    payload: { homeId, measurements, payments, prices },
  })),
}));

import {
  updateHomes,
  updateElectricity,
  updateGas,
  updateWater,
  updateHeating,
} from '../../src/actions/consumption/home';

describe('HomeService', () => {
  const originalWindow = (global as any).window;

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).window = originalWindow || {};
    (global as any).window.filesystem = {
      readFile: jest.fn(),
    };
  });

  afterEach(() => {
    (global as any).window = originalWindow;
  });

  test('fetchHomes dispatches parsed homes and skips empty lines', async () => {
    const fileContent = '{"id":1}\n\n{"id":2}\n';
    (global as any).window.filesystem.readFile.mockResolvedValue(fileContent);

    const dispatch = jest.fn();
    const thunk = HomeService.fetchHomes();
    await thunk(dispatch, jest.fn());

    expect((global as any).window.filesystem.readFile).toHaveBeenCalledWith('consumption/homes/homes.json');
    expect((updateHomes as jest.Mock).mock.calls.length).toBe(1);
    expect((updateHomes as jest.Mock).mock.calls[0][0]).toEqual([{ id: 1 }, { id: 2 }]);
    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_HOMES', payload: [{ id: 1 }, { id: 2 }] });
  });

  test('fetchElectricity reads measurements, payments, prices and dispatches them', async () => {
    const homeId = 'home-123';
    const measurements = '{"m":1}\n\n{"m":2}\n';
    const payments = '{"p":10}\n';
    const prices = '{"r":0.1}\n';
    const rf = (global as any).window.filesystem.readFile;
    rf.mockResolvedValueOnce(measurements).mockResolvedValueOnce(payments).mockResolvedValueOnce(prices);

    const dispatch = jest.fn();
    await HomeService.fetchElectricity(homeId)(dispatch, jest.fn());

    expect(rf).toHaveBeenNthCalledWith(1, `consumption/homes/${homeId}/electricity/measurements.json`);
    expect(rf).toHaveBeenNthCalledWith(2, `consumption/homes/${homeId}/electricity/payments.json`);
    expect(rf).toHaveBeenNthCalledWith(3, `consumption/homes/${homeId}/electricity/prices.json`);

    expect((updateElectricity as jest.Mock).mock.calls.length).toBe(1);
    const callArgs = (updateElectricity as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBe(homeId);
    expect(callArgs[1]).toEqual([{ m: 1 }, { m: 2 }]);
    expect(callArgs[2]).toEqual([{ p: 10 }]);
    expect(callArgs[3]).toEqual([{ r: 0.1 }]);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_ELECTRICITY',
      payload: {
        homeId,
        measurements: [{ m: 1 }, { m: 2 }],
        payments: [{ p: 10 }],
        prices: [{ r: 0.1 }],
      },
    });
  });

  test.each([
    ['gas', (svc: typeof HomeService, id: string) => svc.fetchGas(id), updateGas, 'UPDATE_GAS'],
    ['water', (svc: typeof HomeService, id: string) => svc.fetchWater(id), updateWater, 'UPDATE_WATER'],
    ['heating', (svc: typeof HomeService, id: string) => svc.fetchHeating(id), updateHeating, 'UPDATE_HEATING'],
  ])('%s: reads measurements, payments, prices and dispatches them', async (_, fetcher, updater, expectedType) => {
    const homeId = 'H1';
    const measurements = '{"a":1}\n';
    const payments = '\n'; // newline only, should produce []
    const prices = ''; // empty file should produce []
    const rf = (global as any).window.filesystem.readFile;
    rf.mockResolvedValueOnce(measurements).mockResolvedValueOnce(payments).mockResolvedValueOnce(prices);

    const dispatch = jest.fn();
    await fetcher(HomeService, homeId)(dispatch, jest.fn());

    const resource = _ as string;
    expect(rf).toHaveBeenNthCalledWith(1, `consumption/homes/${homeId}/${resource}/measurements.json`);
    expect(rf).toHaveBeenNthCalledWith(2, `consumption/homes/${homeId}/${resource}/payments.json`);
    expect(rf).toHaveBeenNthCalledWith(3, `consumption/homes/${homeId}/${resource}/prices.json`);

    // updater is a mocked function returning an action object
    expect((updater as jest.Mock).mock.calls.length).toBe(1);
    const args = (updater as jest.Mock).mock.calls[0];
    expect(args[0]).toBe(homeId);
    expect(args[1]).toEqual([{ a: 1 }]); // measurements
    expect(args[2]).toEqual([]); // payments (newline-only -> filtered out)
    expect(args[3]).toEqual([]); // prices (empty -> filtered out)

    expect(dispatch).toHaveBeenCalledWith({
      type: expectedType,
      payload: {
        homeId,
        measurements: [{ a: 1 }],
        payments: [],
        prices: [],
      },
    });
  });

  test('fetchElectricity handles completely empty files and dispatches empty arrays', async () => {
    const homeId = 'empty-home';
    const rf = (global as any).window.filesystem.readFile;
    rf.mockResolvedValueOnce('').mockResolvedValueOnce('').mockResolvedValueOnce('');

    const dispatch = jest.fn();
    await HomeService.fetchElectricity(homeId)(dispatch, jest.fn());

    expect((updateElectricity as jest.Mock).mock.calls.length).toBe(1);
    const args = (updateElectricity as jest.Mock).mock.calls[0];
    expect(args[0]).toBe(homeId);
    expect(args[1]).toEqual([]); // measurements
    expect(args[2]).toEqual([]); // payments
    expect(args[3]).toEqual([]); // prices

    expect(dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_ELECTRICITY',
      payload: { homeId, measurements: [], payments: [], prices: [] },
    });
  });
});