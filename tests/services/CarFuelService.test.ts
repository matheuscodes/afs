import CarFuelService from '../../src/services/CarFuelService';

jest.mock('../../src/actions/consumption/car', () => ({
  updateCars: jest.fn((cars: any[]) => ({ type: 'UPDATE_CARS', payload: cars })),
  updateTankEntries: jest.fn((entries: any[]) => ({ type: 'UPDATE_TANK', payload: entries })),
}));

import { updateCars, updateTankEntries } from '../../src/actions/consumption/car';

describe('CarFuelService', () => {
  const originalWindow = (global as any).window;

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).window = originalWindow || {};
    (global as any).window.filesystem = {
      readFile: jest.fn(),
      readDirectory: jest.fn(),
    };
  });

  afterEach(() => {
    (global as any).window = originalWindow;
  });

  test('fetchCars dispatches parsed cars and skips empty lines', async () => {
    const fileContent = '{"id":1}\n\n{"id":2}\n';
    (global as any).window.filesystem.readFile.mockResolvedValue(fileContent);

    const dispatch = jest.fn();
    const thunk = CarFuelService.fetchCars();
    await thunk(dispatch, jest.fn());

    expect((global as any).window.filesystem.readFile).toHaveBeenCalledWith('consumption/cars.json');
    expect((updateCars as jest.Mock).mock.calls.length).toBe(1);
    expect((updateCars as jest.Mock).mock.calls[0][0]).toEqual([{ id: 1 }, { id: 2 }]);
    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_CARS', payload: [{ id: 1 }, { id: 2 }] });
  });

  test('fetchTankEntries dispatches parsed entries and handles newline-only (empty) result', async () => {
    (global as any).window.filesystem.readDirectory.mockResolvedValue('\n');

    const dispatch = jest.fn();
    const thunk = CarFuelService.fetchTankEntries();
    await thunk(dispatch, jest.fn());

    expect((global as any).window.filesystem.readDirectory).toHaveBeenCalledWith('consumption/cars');
    expect((updateTankEntries as jest.Mock).mock.calls.length).toBe(1);
    expect((updateTankEntries as jest.Mock).mock.calls[0][0]).toEqual([]);
    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_TANK', payload: [] });
  });

  test('fetchCars handles completely empty file and dispatches empty array', async () => {
    (global as any).window.filesystem.readFile.mockResolvedValue('');

    const dispatch = jest.fn();
    await CarFuelService.fetchCars()(dispatch, jest.fn());

    expect((updateCars as jest.Mock).mock.calls.length).toBe(1);
    expect((updateCars as jest.Mock).mock.calls[0][0]).toEqual([]);
    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_CARS', payload: [] });
  });
});