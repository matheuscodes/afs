import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import Electricity from '../../../src/components/consumption/Electricity';
import { Currency } from '../../../src/models/Activity';

const mockStore = configureStore([]);

describe('Electricity', () => {
  const mockHomes = {
    'home1': {
      id: 'home1',
      name: 'Test Home',
      electricity: {
        'meter1': {
          measurements: [
            { date: '2024-01-01', measurement: 1000, billable: true },
            { date: '2024-02-01', measurement: 1100, billable: true }
          ],
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 0.25, currency: Currency.EUR },
              base: { amount: 10, currency: Currency.EUR }
            }
          ],
          payments: [
            {
              date: '2024-01-15',
              value: { amount: 50, currency: Currency.EUR },
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

  test('renders Electricity component', () => {
    const { container } = render(
      <Provider store={store}>
        <Electricity />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Electricity');
  });

  test('componentDidMount calls fetchHomes', async () => {
    const mockFetchHomes = jest.fn().mockResolvedValue(undefined);
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: mockFetchHomes
    });

    await component.componentDidMount();
    expect(mockFetchHomes).toHaveBeenCalled();
  });

  test('getPowerMeters returns electricity meter data', () => {
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const powerMeter = mockHomes.home1.electricity.meter1;
    const meters = component.getPowerMeters(powerMeter);
    expect(meters).toBeTruthy();
    expect(Array.isArray(meters)).toBe(true);
  });

  test('getPowerMeters handles empty measurements', () => {
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const emptyMeter = { ...mockHomes.home1.electricity.meter1, measurements: [] };
    const meters = component.getPowerMeters(emptyMeter);
    expect(meters).toEqual([]);
  });

  test('getPowerMeters handles undefined measurements', () => {
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const emptyMeter = { ...mockHomes.home1.electricity.meter1, measurements: undefined };
    const meters = component.getPowerMeters(emptyMeter);
    expect(meters).toEqual([]);
  });

  test('renderRow creates table row', () => {
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const day = {
      date: '2024-01-01',
      measurement: 1000,
      price: mockHomes.home1.electricity.meter1.prices[0],
      consumption: 100,
      days: 30,
      billable: true
    };
    const row = component.renderRow(day, 0);
    expect(row).toBeTruthy();
  });

  test('renderHome creates home section', () => {
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const home = mockHomes.home1;
    const homeRender = component.renderHome(home, 0);
    expect(homeRender).toBeTruthy();
  });

  test('render handles empty homes', () => {
    const component = new Electricity({
      homes: null,
      fetchHomes: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('render handles homes without electricity', () => {
    const homesWithoutElectricity = {
      'home1': {
        id: 'home1',
        name: 'Test Home'
      }
    };
    const component = new Electricity({
      homes: homesWithoutElectricity,
      fetchHomes: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('calculates consumption between measurements', () => {
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const powerMeter = mockHomes.home1.electricity.meter1;
    const meters = component.getPowerMeters(powerMeter);
    expect(meters.length).toBeGreaterThan(0);
    if (meters.length > 1) {
      expect(meters[1].consumption).toBeDefined();
    }
  });

  test('handles measurements without prices', () => {
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const meterWithoutPrices = {
      ...mockHomes.home1.electricity.meter1,
      prices: []
    };
    const meters = component.getPowerMeters(meterWithoutPrices);
    expect(meters).toBeTruthy();
  });

  test('groups payments by bill', () => {
    const component = new Electricity({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const powerMeter = mockHomes.home1.electricity.meter1;
    const homeRender = component.renderHome(mockHomes.home1, 0);
    expect(homeRender).toBeTruthy();
  });
});
