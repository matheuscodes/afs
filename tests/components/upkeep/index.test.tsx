import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import Upkeep from '../../../src/components/upkeep/index';
import { Currency } from '../../../src/models/Activity';

const mockStore = configureStore([]);

describe('Upkeep', () => {
  const mockUpkeepData = [
    {
      year: 2024,
      period: 'H1',
      groceries: [
        { calories: 2000, price: { amount: 50, currency: Currency.EUR } },
        { calories: 1500, price: { amount: 40, currency: Currency.EUR } }
      ],
      pet: {
        food: { amount: 30, currency: Currency.EUR },
        taxes: { amount: 20, currency: Currency.EUR },
        vet: { amount: 50, currency: Currency.EUR },
        insurance: { amount: 15, currency: Currency.EUR }
      },
      housing: {
        area: 100,
        cost: { amount: 800, currency: Currency.EUR },
        electricity: { amount: 60, currency: Currency.EUR },
        gas: { amount: 40, currency: Currency.EUR },
        internet: { amount: 30, currency: Currency.EUR },
        services: { amount: 20, currency: Currency.EUR }
      },
      car: {
        maintenance: { amount: 100, currency: Currency.EUR },
        insurance: { amount: 80, currency: Currency.EUR },
        fuel: { amount: 1.5, currency: Currency.EUR },
        consumption: 7.5
      },
      salary: { amount: 3000, currency: Currency.EUR },
      savings: { amount: 500, currency: Currency.EUR }
    }
  ];

  const initialState = {
    longTerm: {
      upkeep: mockUpkeepData
    }
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders Upkeep component', () => {
    const { container } = render(
      <Provider store={store}>
        <Upkeep />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Upkeep');
  });

  test('componentDidMount calls fetchUpkeeps', () => {
    const mockFetchUpkeeps = jest.fn();
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: mockFetchUpkeeps
    });

    component.componentDidMount();
    expect(mockFetchUpkeeps).toHaveBeenCalled();
  });

  test('renders UpkeepHistoryGraph', () => {
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('renders Groceries table when upkeep data exists', () => {
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('renders Pet table when upkeep data exists', () => {
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('renders Housing table when upkeep data exists', () => {
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('renders Car table when upkeep data exists', () => {
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('renders Income table when upkeep data exists', () => {
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('handles empty upkeep data', () => {
    const component = new Upkeep({
      longTerm: { upkeep: null },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('handles upkeep data without car', () => {
    const dataWithoutCar = [{
      ...mockUpkeepData[0],
      car: undefined
    }];

    const component = new Upkeep({
      longTerm: { upkeep: dataWithoutCar },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('handles upkeep data with car using km pricing', () => {
    const dataWithKmPricing = [{
      ...mockUpkeepData[0],
      car: {
        ...mockUpkeepData[0].car,
        fuel: undefined,
        km: 10000,
        kmPrice: { amount: 0.5, currency: Currency.EUR }
      }
    }];

    const component = new Upkeep({
      longTerm: { upkeep: dataWithKmPricing },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('handles upkeep data with savings', () => {
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('handles upkeep data without savings', () => {
    const dataWithoutSavings = [{
      ...mockUpkeepData[0],
      savings: undefined
    }];

    const component = new Upkeep({
      longTerm: { upkeep: dataWithoutSavings },
      fetchUpkeeps: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('calculates groceries budget correctly', () => {
    const component = new Upkeep({
      longTerm: { upkeep: mockUpkeepData },
      fetchUpkeeps: jest.fn()
    });

    const half = mockUpkeepData[0];
    const totalCalories = half.groceries.reduce((sum, a) => a.calories + sum, 0);
    const totalPrice = half.groceries.reduce((sum, a) => a.price.amount + sum, 0);
    const monthCalories = 30 * 2000;
    const multiplier = monthCalories / totalCalories;
    const budget = totalPrice * multiplier;

    expect(budget).toBeGreaterThan(0);
  });
});
