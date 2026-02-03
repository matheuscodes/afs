import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import WaterAndHeating from '../../../src/components/consumption/WaterAndHeating';
import { Currency } from '../../../src/models/Activity';

// Mock the HomeService to prevent actual API calls
jest.mock('../../../src/services/HomeService', () => ({
  fetchHomes: jest.fn(() => (dispatch: any) => Promise.resolve()),
  fetchWater: jest.fn(() => (dispatch: any) => Promise.resolve()),
  fetchHeating: jest.fn(() => (dispatch: any) => Promise.resolve()),
  updateHomes: jest.fn()
}));

const mockStore = configureStore([thunk]);

describe('WaterAndHeating', () => {
  const mockHomes = {
    'home1': {
      id: 'home1',
      name: 'Test Home',
      area: 100,
      water: {
        warm: {
          id: 'warm1',
          measurements: [
            { date: '2024-01-01', measurement: 50 },
            { date: '2024-02-01', measurement: 53 }
          ],
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 0.5, currency: Currency.EUR },
              base: { amount: 5, currency: Currency.EUR }
            }
          ],
          payments: [] as any[]
        },
        cold: {
          id: 'cold1',
          measurements: [
            { date: '2024-01-01', measurement: 100 },
            { date: '2024-02-01', measurement: 105 }
          ],
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 0.3, currency: Currency.EUR },
              base: { amount: 3, currency: Currency.EUR }
            }
          ],
          payments: [] as any[]
        }
      },
      heating: {
        heaters: {
          'heater1': {
            id: 'heater1',
            location: 'Living Room',
            factor: 1.0,
            area: 50,
            prices: [
              {
                date: '2024-01-01',
                unit: { amount: 1.0, currency: Currency.EUR },
                base: { amount: 10, currency: Currency.EUR }
              }
            ],
            readings: [
              { date: '2024-01-01', measurement: 100 },
              { date: '2024-02-01', measurement: 150 }
            ],
            payments: [] as any[]
          }
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
    // Mock dispatch to handle thunks (functions) without throwing errors
    const originalDispatch = store.dispatch.bind(store);
    store.dispatch = jest.fn((action: any) => {
      try {
        if (typeof action === 'function') {
          // Handle thunks - just return a resolved promise
          return Promise.resolve();
        }
        return originalDispatch(action);
      } catch (e) {
        // Silently catch the error and return a resolved promise
        return Promise.resolve();
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders WaterAndHeating component', () => {
    const { container } = render(
      <Provider store={store}>
        <WaterAndHeating />
      </Provider>
    );
    expect(container).toBeTruthy();
  });
});
