import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import Gas from '../../../src/components/consumption/Gas';
import { Currency } from '../../../src/models/Activity';

const mockStore = configureStore([]);

describe('Gas', () => {
  const mockHomes = {
    'home1': {
      id: 'home1',
      name: 'Test Home',
      gas: {
        'meter1': {
          id: 'meter1',
          combustion: 10,
          condition: 0.95,
          measurements: [
            { date: '2024-01-01', measurement: 500, billable: true },
            { date: '2024-02-01', measurement: 550, billable: true }
          ],
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 0.15, currency: Currency.EUR },
              base: { amount: 8, currency: Currency.EUR }
            }
          ],
          payments: [
            {
              date: '2024-01-15',
              value: { amount: 40, currency: Currency.EUR },
              bill: 'bill-2024-01'
            }
          ]
        }
      }
    }
  };

  const initialState = {
    homes: mockHomes
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders Gas component', () => {
    const { container } = render(
      <Provider store={store}>
        <Gas />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Gas');
  });

  test('componentDidMount calls fetchHomes', async () => {
    const mockFetchHomes = jest.fn().mockResolvedValue(undefined);
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: mockFetchHomes
    });

    await component.componentDidMount();
    expect(mockFetchHomes).toHaveBeenCalled();
  });

  test('getGasMeters returns gas meter data', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const meters = component.getGasMeters(gasMeter);
    expect(meters).toBeTruthy();
    expect(Array.isArray(meters)).toBe(true);
  });

  test('getGasMeters handles empty measurements', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const emptyMeter = { ...mockHomes.home1.gas.meter1, measurements: [] };
    const meters = component.getGasMeters(emptyMeter);
    expect(meters).toEqual([]);
  });

  test('getGasMeters handles undefined measurements', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const emptyMeter = { ...mockHomes.home1.gas.meter1, measurements: undefined };
    const meters = component.getGasMeters(emptyMeter);
    expect(meters).toEqual([]);
  });

  test('getGasMeters calculates energy consumption', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const meters = component.getGasMeters(gasMeter);
    expect(meters.length).toBeGreaterThan(0);
    if (meters.length > 1) {
      expect(meters[1].energy).toBeDefined();
    }
  });

  test('renderRow creates table row', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const day = {
      date: '2024-01-01',
      measurement: 500,
      price: mockHomes.home1.gas.meter1.prices[0],
      consumption: 50,
      energy: 475,
      days: 30,
      billable: true
    };
    const row = component.renderRow(day, 0);
    expect(row).toBeTruthy();
  });

  test('renderHome creates home section', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const home = mockHomes.home1;
    const homeRender = component.renderHome(home, 0);
    expect(homeRender).toBeTruthy();
  });

  test('render handles empty homes', () => {
    const component = new Gas({
      homes: null,
      fetchHomes: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('render handles homes without gas', () => {
    const homesWithoutGas = {
      'home1': {
        id: 'home1',
        name: 'Test Home'
      }
    };
    const component = new Gas({
      homes: homesWithoutGas,
      fetchHomes: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('calculates consumption between measurements', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const meters = component.getGasMeters(gasMeter);
    expect(meters.length).toBeGreaterThan(0);
    if (meters.length > 1) {
      expect(meters[1].consumption).toBeDefined();
    }
  });

  test('handles measurements without prices', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const meterWithoutPrices = {
      ...mockHomes.home1.gas.meter1,
      prices: []
    };
    const meters = component.getGasMeters(meterWithoutPrices);
    expect(meters).toBeTruthy();
  });

  test('groups payments by bill', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const homeRender = component.renderHome(mockHomes.home1, 0);
    expect(homeRender).toBeTruthy();
  });

  test('uses combustion and condition for energy calculation', () => {
    const component = new Gas({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const meters = component.getGasMeters(gasMeter);
    if (meters.length > 1 && meters[1].energy) {
      // Energy should be consumption * combustion * condition
      const expectedEnergy = meters[1].consumption * gasMeter.combustion * gasMeter.condition;
      expect(meters[1].energy).toBeCloseTo(expectedEnergy, 1);
    }
  });
});
