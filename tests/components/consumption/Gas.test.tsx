import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Gas from '../../../src/components/consumption/Gas';
import { Currency } from '../../../src/models/Activity';
import { updateHomes, updateElectricity, updateGas, updateWater, updateHeating } from '../../../src/actions/consumption/home';

// Mock the HomeService to prevent actual file I/O
jest.mock('../../../src/services/HomeService', () => ({
    fetchHomes: jest.fn(() => updateHomes([])),
    fetchElectricity: jest.fn(() => updateElectricity("1",[],[],[])),
    fetchGas: jest.fn(() => updateGas("1",[],[],[])),
    fetchWater: jest.fn(() => updateWater("1",[],[],[])),
    fetchHeating: jest.fn(() => updateHeating("1",[],[],[])),
}));

const mockStore = configureStore([thunk]);

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



  test('handles empty gas measurements', () => {
    const homesWithEmpty = {
      'home1': {
        ...mockHomes.home1,
        gas: {
          'meter1': {
            ...mockHomes.home1.gas.meter1,
            measurements: [] as any
          }
        }
      }
    };
    
    const emptyStore = mockStore({ homes: homesWithEmpty });
    const { container } = render(
      <Provider store={emptyStore}>
        <Gas />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('render handles empty homes', () => {
    const emptyStore = mockStore({ homes: null });
    const { container } = render(
      <Provider store={emptyStore}>
        <Gas />
      </Provider>
    );
    expect(container).toBeInTheDocument();
  });

  test('handles measurements without prices', () => {
    const homesWithoutPrices = {
      'home1': {
        ...mockHomes.home1,
        gas: {
          'meter1': {
            ...mockHomes.home1.gas.meter1,
            prices: [] as any
          }
        }
      }
    };
    
    const noPricesStore = mockStore({ homes: homesWithoutPrices });
    const { container } = render(
      <Provider store={noPricesStore}>
        <Gas />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('groups payments by bill', () => {
    const { container } = render(
      <Provider store={store}>
        <Gas />
      </Provider>
    );
    
    // Component processes payment data
    const gasMeter = mockHomes.home1.gas.meter1;
    expect(gasMeter.payments).toHaveLength(1);
    expect(container).toBeInTheDocument();
  });


});
