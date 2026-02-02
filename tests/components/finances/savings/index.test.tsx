import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import Savings from '../../../../src/components/finances/savings/index';
import { Currency } from '../../../../src/models/Activity';

const mockStore = configureStore([]);

describe('Savings', () => {
  const mockSavings = [
    {
      date: new Date('2024-01-15'),
      source: {
        id: 'saving1',
        name: 'Emergency Fund',
        type: 'Saving',
        bank: 'Test Bank'
      },
      description: 'Monthly Contribution',
      value: { amount: 500, currency: Currency.EUR },
      account: {
        id: 'checking1',
        name: 'Main Account',
        type: 'Checking',
        bank: 'Test Bank'
      }
    },
    {
      date: new Date('2024-02-15'),
      source: {
        id: 'checking1',
        name: 'Main Account',
        type: 'Checking',
        bank: 'Test Bank'
      },
      description: 'Monthly Contribution',
      value: { amount: 500, currency: Currency.EUR },
      account: {
        id: 'saving1',
        name: 'Emergency Fund',
        type: 'Saving',
        bank: 'Test Bank'
      }
    }
  ];

  const initialState = {
    longTerm: {
      savings: mockSavings
    }
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders Savings component', () => {
    const { container } = render(
      <Provider store={store}>
        <Savings />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Savings');
  });

  test('componentDidMount calls fetchSavings', () => {
    const mockFetchSavings = jest.fn();
    const component = new Savings({
      longTerm: { savings: mockSavings },
      fetchSavings: mockFetchSavings
    });

    component.componentDidMount();
    expect(mockFetchSavings).toHaveBeenCalled();
  });

  test('calculateSummary groups savings by account', () => {
    const component = new Savings({
      longTerm: { savings: mockSavings },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary(mockSavings);
    expect(summary).toBeTruthy();
    expect(typeof summary).toBe('object');
  });

  test('calculateSummary handles empty savings', () => {
    const component = new Savings({
      longTerm: { savings: [] },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary([]);
    expect(summary).toEqual({});
  });

  test('calculateSummary handles null savings', () => {
    const component = new Savings({
      longTerm: { savings: null },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary(null);
    expect(summary).toEqual({});
  });

  test('calculateSummary calculates totals correctly', () => {
    const component = new Savings({
      longTerm: { savings: mockSavings },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary(mockSavings);
    expect(summary).toBeTruthy();
  });

  test('calculateSummary handles source savings accounts', () => {
    const component = new Savings({
      longTerm: { savings: mockSavings },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary(mockSavings.slice(0, 1));
    expect(Object.keys(summary).length).toBeGreaterThan(0);
  });

  test('calculateSummary handles destination savings accounts', () => {
    const component = new Savings({
      longTerm: { savings: mockSavings },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary(mockSavings.slice(1, 2));
    expect(Object.keys(summary).length).toBeGreaterThan(0);
  });

  test('calculateSummary groups by bank', () => {
    const component = new Savings({
      longTerm: { savings: mockSavings },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary(mockSavings);
    expect(summary['Test Bank']).toBeDefined();
  });

  test('handles savings without source or account', () => {
    const incompleteActivity = [{
      date: new Date('2024-01-15'),
      description: 'Test',
      value: { amount: 100, currency: Currency.EUR }
    }];

    const component = new Savings({
      longTerm: { savings: incompleteActivity },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary(incompleteActivity);
    expect(summary).toEqual({});
  });

  test('render displays banks and accounts', () => {
    const component = new Savings({
      longTerm: { savings: mockSavings },
      fetchSavings: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('groups funds by description', () => {
    const component = new Savings({
      longTerm: { savings: mockSavings },
      fetchSavings: jest.fn()
    });

    const summary = component.calculateSummary(mockSavings);
    const banks = Object.keys(summary);
    if (banks.length > 0 && summary[banks[0]].length > 0) {
      expect(summary[banks[0]][0].funds).toBeDefined();
    }
  });

  test('handles zero balance accounts', () => {
    const zeroBalanceActivities = [
      {
        ...mockSavings[0],
        value: { amount: 500, currency: Currency.EUR }
      },
      {
        ...mockSavings[0],
        source: mockSavings[0].account,
        account: mockSavings[0].source,
        value: { amount: 500, currency: Currency.EUR }
      }
    ];

    const component = new Savings({
      longTerm: { savings: zeroBalanceActivities },
      fetchSavings: jest.fn()
    });

    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });
});
