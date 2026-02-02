import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import WaterAndHeating from '../../../src/components/consumption/WaterAndHeating';
import { Currency } from '../../../src/models/Activity';

const mockStore = configureStore([]);

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
          payments: []
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
          payments: []
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
            payments: []
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
  });

  test('renders WaterAndHeating component', () => {
    const { container } = render(
      <Provider store={store}>
        <WaterAndHeating />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Water and Heating');
  });

  test('componentDidMount calls fetchHomes', async () => {
    const mockFetchHomes = jest.fn().mockResolvedValue(undefined);
    const component = new WaterAndHeating({
      homes: mockHomes,
      fetchHomes: mockFetchHomes
    });

    await component.componentDidMount();
    expect(mockFetchHomes).toHaveBeenCalled();
  });

  test('renderHome creates home section', () => {
    const component = new WaterAndHeating({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const home = mockHomes.home1;
    const homeRender = component.renderHome(home, 0);
    expect(homeRender).toBeTruthy();
  });

  test('render handles empty homes', () => {
    const component = new WaterAndHeating({
      homes: null,
      fetchHomes: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('constructor initializes with empty state', () => {
    const component = new WaterAndHeating({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    expect(component.state).toEqual({});
  });

  test('handles homes without water data', () => {
    const homesWithoutWater = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100
      }
    };
    const component = new WaterAndHeating({
      homes: homesWithoutWater,
      fetchHomes: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('handles homes without heating data', () => {
    const homesWithoutHeating = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: mockHomes.home1.water
      }
    };
    const component = new WaterAndHeating({
      homes: homesWithoutHeating,
      fetchHomes: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('processes water meter data', () => {
    const component = new WaterAndHeating({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const home = mockHomes.home1;
    const homeRender = component.renderHome(home, 0);
    expect(homeRender).toBeTruthy();
  });

  test('processes heating data', () => {
    const component = new WaterAndHeating({
      homes: mockHomes,
      fetchHomes: jest.fn()
    });

    const home = mockHomes.home1;
    const homeRender = component.renderHome(home, 0);
    expect(homeRender).toBeTruthy();
  });

  test('handles multiple homes', () => {
    const multipleHomes = {
      ...mockHomes,
      'home2': {
        ...mockHomes.home1,
        id: 'home2',
        name: 'Second Home'
      }
    };
    const component = new WaterAndHeating({
      homes: multipleHomes,
      fetchHomes: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });
});
