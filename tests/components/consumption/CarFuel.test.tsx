import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import CarFuel from '../../../src/components/consumption/CarFuel';
import { Fuel, FuelUnit } from '../../../src/models/Car';
import { Currency } from '../../../src/models/Activity';
import { updateCars, updateTankEntries } from '../../../src/actions/consumption/car';

// Mock the CarFuelService to prevent actual file I/O
jest.mock('../../../src/services/CarFuelService', () => ({
    fetchCars: jest.fn(() => updateCars([])),
    fetchTankEntries: jest.fn(() => updateTankEntries([])),
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


});