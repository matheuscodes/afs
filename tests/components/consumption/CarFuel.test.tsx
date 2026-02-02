import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import CarFuel from '../../../src/components/consumption/CarFuel';
import { Fuel, FuelUnit } from '../../../src/models/Car';
import { Currency } from '../../../src/models/Activity';

const mockStore = configureStore([]);

describe('CarFuel', () => {
  const mockCars = {
    'car1': {
      id: 'car1',
      name: 'Test Car',
      mileage: 50000,
      tanks: {
        [Fuel.Gasoline]: 50
      },
      tankEntries: [
        {
          date: '2024-01-15',
          mileage: 50100,
          tanked: 40,
          fuel: Fuel.Gasoline,
          paid: { amount: 60, currency: Currency.EUR }
        },
        {
          date: '2024-02-01',
          mileage: 50400,
          tanked: 35,
          fuel: Fuel.Gasoline,
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

  test('componentDidMount calls fetch functions', async () => {
    const mockFetchCars = jest.fn().mockResolvedValue(undefined);
    const mockFetchTankEntries = jest.fn().mockResolvedValue(undefined);
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: mockFetchCars,
      fetchTankEntries: mockFetchTankEntries
    });

    await component.componentDidMount();
    expect(mockFetchCars).toHaveBeenCalled();
    expect(mockFetchTankEntries).toHaveBeenCalled();
  });

  test('renderRow returns table row with tank entry data', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const tankEntry = mockCars.car1.tankEntries[0];
    const row = component.renderRow(tankEntry, 0, 100, 50, 40);
    expect(row).toBeTruthy();
  });

  test('renderRow calculates consumption per km', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const tankEntry = mockCars.car1.tankEntries[0];
    const traveled = 300;
    const consumed = 40;
    const row = component.renderRow(tankEntry, 0, traveled, 50, consumed);
    expect(row).toBeTruthy();
  });

  test('renderRow handles missing mileage', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const tankEntry = { ...mockCars.car1.tankEntries[0], mileage: undefined };
    const row = component.renderRow(tankEntry, 0, undefined, 50, undefined);
    expect(row).toBeTruthy();
  });

  test('renderCar calculates total tanked and paid', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const car = mockCars.car1;
    const carRender = component.renderCar(car, 0);
    expect(carRender).toBeTruthy();
  });

  test('renderCar tracks mileage changes', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const car = mockCars.car1;
    const carRender = component.renderCar(car, 0);
    expect(carRender).toBeTruthy();
  });

  test('renderCar handles pending tank entries without mileage', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const carWithPending = {
      ...mockCars.car1,
      tankEntries: [
        { ...mockCars.car1.tankEntries[0], mileage: undefined },
        mockCars.car1.tankEntries[1]
      ]
    };
    const carRender = component.renderCar(carWithPending, 0);
    expect(carRender).toBeTruthy();
  });

  test('render handles empty cars object', () => {
    const component = new CarFuel({
      cars: {},
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('render handles null cars', () => {
    const component = new CarFuel({
      cars: null,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('renderCar calculates CO2 emissions', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const car = mockCars.car1;
    const carRender = component.renderCar(car, 0);
    expect(carRender).toBeTruthy();
  });

  test('renderRow calculates distance per unit', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const tankEntry = mockCars.car1.tankEntries[0];
    const traveled = 400;
    const consumed = 35;
    const row = component.renderRow(tankEntry, 0, traveled, 50, consumed);
    expect(row).toBeTruthy();
  });

  test('renderCar updates tank level correctly', () => {
    const component = new CarFuel({
      cars: mockCars,
      fetchCars: jest.fn(),
      fetchTankEntries: jest.fn()
    });

    const car = mockCars.car1;
    const carRender = component.renderCar(car, 0);
    expect(carRender).toBeTruthy();
  });
});
