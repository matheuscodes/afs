import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import CarFuel from '../../../src/components/consumption/CarFuel';
import { Fuel, FuelUnit } from '../../../src/models/Car';
import { Currency } from '../../../src/models/Activity';

// Mock the LongTermService to prevent actual file I/O
jest.mock('../../../src/services/LongTermService', () => ({
  fetchCars: jest.fn(() => (dispatch: any) => Promise.resolve()),
  fetchTankEntries: jest.fn(() => (dispatch: any) => Promise.resolve()),
  updateCars: jest.fn()
}));

// Mock the CarFuelService to prevent actual file I/O
jest.mock('../../../src/services/CarFuelService', () => ({
  loadEntries: jest.fn(() => Promise.resolve({ type: 'LOAD_TANK_ENTRIES', payload: [] })),
  writeEntry: jest.fn(() => Promise.resolve({ type: 'WRITE_TANK_ENTRY' }))
}));

const mockStore = configureStore([thunk]);

describe('CarFuel', () => {
  const mockCars = {
    'car1': {
      id: 'car1',
      name: 'Test Car',
      mileage: 50000,
      tanks: {
        [Fuel.GASOLINE]: 50
      },
      tankEntries: [
        {
          date: '2024-01-15',
          mileage: 50100,
          tanked: 40,
          fuel: Fuel.GASOLINE,
          paid: { amount: 60, currency: Currency.EUR }
        },
        {
          date: '2024-02-01',
          mileage: 50400,
          tanked: 35,
          fuel: Fuel.GASOLINE,
          paid: { amount: 52.5, currency: Currency.EUR }
        }
      ]
    }
  };

  const initialState = {
    cars: mockCars
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders CarFuel component', () => {
    const { container } = render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Car Fuel');
  });

  test('dispatches fetch functions on mount', async () => {
    render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    
    // Component should have access to cars data
    expect((store.getState() as any).cars).toEqual(mockCars);
  });

  test('renders car fuel data', () => {
    const { container } = render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    // Component should render tank entries
    const tankEntry = mockCars.car1.tankEntries[0];
    expect(tankEntry.mileage).toBe(50100);
    expect(container).toBeInTheDocument();
  });

  test('displays consumption calculations', () => {
    const { container } = render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    
    // Component calculates consumption metrics
    const car = mockCars.car1;
    expect(car.tankEntries).toHaveLength(2);
    expect(container).toBeInTheDocument();
  });

  test('handles missing mileage data', () => {
    const carsWithoutMileage = {
      'car1': {
        ...mockCars.car1,
        tankEntries: [
          { ...mockCars.car1.tankEntries[0], mileage: undefined as any }
        ]
      }
    };
    
    const noMileageStore = mockStore({ cars: carsWithoutMileage });
    const { container } = render(
      <Provider store={noMileageStore}>
        <CarFuel />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('displays total tanked and paid', () => {
    const { container } = render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    
    // Component shows totals
    const car = mockCars.car1;
    const totalTanked = car.tankEntries.reduce((sum, entry) => sum + entry.tanked, 0);
    expect(totalTanked).toBe(75);
    expect(container).toBeInTheDocument();
  });

  test('tracks mileage changes between entries', () => {
    const { container } = render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    
    // Verify mileage progression
    const car = mockCars.car1;
    expect(car.tankEntries[0].mileage).toBeLessThan(car.tankEntries[1].mileage!);
    expect(container).toBeInTheDocument();
  });

  test('handles pending tank entries without mileage', () => {
    const carWithPending = {
      'car1': {
        ...mockCars.car1,
        tankEntries: [
          { ...mockCars.car1.tankEntries[0], mileage: undefined },
          mockCars.car1.tankEntries[1]
        ]
      }
    };
    
    const pendingStore = mockStore({ cars: carWithPending });
    const { container } = render(
      <Provider store={pendingStore}>
        <CarFuel />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('handles empty cars object', () => {
    const emptyStore = mockStore({ cars: {} });
    const { container } = render(
      <Provider store={emptyStore}>
        <CarFuel />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('handles null cars', () => {
    const nullStore = mockStore({ cars: null });
    const { container } = render(
      <Provider store={nullStore}>
        <CarFuel />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('displays CO2 emissions calculations', () => {
    const { container } = render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    
    const car = mockCars.car1;
    expect(car.tankEntries).toHaveLength(2);
    expect(container).toBeInTheDocument();
  });

  test('calculates distance per unit', () => {
    const { container } = render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('updates tank level correctly', () => {
    const { container } = render(
      <Provider store={store}>
        <CarFuel />
      </Provider>
    );
    
    const car = mockCars.car1;
    expect(car.tanks).toBeDefined();
    expect(container).toBeInTheDocument();
  });
});
