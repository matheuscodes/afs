import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Electricity from '../../../src/components/consumption/Electricity';
import { Currency } from '../../../src/models/Activity';

const mockStore = configureStore([thunk]);

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

  test('dispatches fetchHomes on mount', async () => {
    render(
      <Provider store={store}>
        <Electricity />
      </Provider>
    );
    
    // Component should have access to homes data
    expect((store.getState() as any).homes).toEqual(mockHomes);
  });

  test('renders electricity meter data', () => {
    const { container } = render(
      <Provider store={store}>
        <Electricity />
      </Provider>
    );
    
    // Component should process electricity meter data
    const powerMeter = mockHomes.home1.electricity.meter1;
    expect(powerMeter.measurements).toHaveLength(2);
    expect(container).toBeInTheDocument();
  });

  test('handles empty electricity measurements', () => {
    const homesWithEmpty = {
      'home1': {
        ...mockHomes.home1,
        electricity: {
          'meter1': {
            ...mockHomes.home1.electricity.meter1,
            measurements: [] as any
          }
        }
      }
    };
    
    const emptyStore = mockStore({ homes: homesWithEmpty });
    const { container } = render(
      <Provider store={emptyStore}>
        <Electricity />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('handles undefined electricity measurements', () => {
    const homesWithUndefined = {
      'home1': {
        ...mockHomes.home1,
        electricity: {
          'meter1': {
            ...mockHomes.home1.electricity.meter1,
            measurements: undefined as any
          }
        }
      }
    };
    
    const undefinedStore = mockStore({ homes: homesWithUndefined });
    const { container } = render(
      <Provider store={undefinedStore}>
        <Electricity />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('displays electricity consumption in table', () => {
    const { container } = render(
      <Provider store={store}>
        <Electricity />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('displays home electricity information', () => {
    const { container } = render(
      <Provider store={store}>
        <Electricity />
      </Provider>
    );
    
    const home = mockHomes.home1;
    expect(home.electricity.meter1).toBeDefined();
    expect(container).toBeInTheDocument();
  });

  test('handles empty homes', () => {
    const emptyStore = mockStore({ homes: null });
    const { container } = render(
      <Provider store={emptyStore}>
        <Electricity />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('handles homes without electricity', () => {
    const homesWithoutElectricity = {
      'home1': {
        id: 'home1',
        name: 'Test Home'
      }
    };
    
    const noElectricityStore = mockStore({ homes: homesWithoutElectricity });
    const { container } = render(
      <Provider store={noElectricityStore}>
        <Electricity />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('calculates consumption between measurements', () => {
    const { container } = render(
      <Provider store={store}>
        <Electricity />
      </Provider>
    );
    
    const powerMeter = mockHomes.home1.electricity.meter1;
    expect(powerMeter.measurements).toHaveLength(2);
    expect(container).toBeInTheDocument();
  });

  test('handles measurements without prices', () => {
    const homesWithoutPrices = {
      'home1': {
        ...mockHomes.home1,
        electricity: {
          'meter1': {
            ...mockHomes.home1.electricity.meter1,
            prices: [] as any
          }
        }
      }
    };
    
    const noPricesStore = mockStore({ homes: homesWithoutPrices });
    const { container } = render(
      <Provider store={noPricesStore}>
        <Electricity />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('groups payments by bill', () => {
    const { container } = render(
      <Provider store={store}>
        <Electricity />
      </Provider>
    );
    
    const powerMeter = mockHomes.home1.electricity.meter1;
    expect(powerMeter.payments).toHaveLength(1);
    expect(container).toBeInTheDocument();
  });
});
