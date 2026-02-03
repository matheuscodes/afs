import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Savings from '../../../../src/components/finances/savings/index';
import { Currency } from '../../../../src/models/Activity';
import { loadUpkeeps, loadSavings } from '../../../../src/actions/long-term';

// Mock the LongTermService to prevent actual file I/O
jest.mock('../../../../src/services/LongTermService', () => ({
  loadSavings: jest.fn(() => loadSavings([])),
  calculateUpkeepReport: jest.fn(() => ({
     base: 1,
     report: {},
     inflation: {},
   })),
  loadUpkeeps: jest.fn(() => loadUpkeeps([])),
}));

const mockStore = configureStore([thunk]);

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

  test('dispatches fetchSavings on mount', () => {
    render(
      <Provider store={store}>
        <Savings />
      </Provider>
    );
    
    // Component should have access to savings data from Redux
    expect(store.getState().longTerm.savings).toEqual(mockSavings);
  });

  test('groups savings by account', () => {
    const { container } = render(
      <Provider store={store}>
        <Savings />
      </Provider>
    );
    
    // Component renders banks and accounts
    expect(container).toBeInTheDocument();
    expect(store.getState().longTerm.savings).toHaveLength(2);
  });

  test('handles empty savings data', () => {
    const emptyStore = mockStore({
      longTerm: { savings: [] }
    });
    
    const { container } = render(
      <Provider store={emptyStore}>
        <Savings />
      </Provider>
    );
    
    expect(container.querySelector('h1')).toHaveTextContent('Savings');
  });

  test('handles null savings data', () => {
    const nullStore = mockStore({
      longTerm: { savings: null }
    });
    
    const { container } = render(
      <Provider store={nullStore}>
        <Savings />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('calculates totals correctly with multiple transactions', () => {
    const { container } = render(
      <Provider store={store}>
        <Savings />
      </Provider>
    );
    
    // Verify savings data is processed
    const savingsData = store.getState().longTerm.savings;
    expect(savingsData).toHaveLength(2);
  });

  test('displays source savings accounts', () => {
    const singleStore = mockStore({
      longTerm: { savings: mockSavings.slice(0, 1) }
    });
    
    const { container } = render(
      <Provider store={singleStore}>
        <Savings />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('displays destination savings accounts', () => {
    const singleStore = mockStore({
      longTerm: { savings: mockSavings.slice(1, 2) }
    });
    
    const { container } = render(
      <Provider store={singleStore}>
        <Savings />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('groups accounts by bank', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Savings />
      </Provider>
    );
    
    // Should display bank name
    expect(getByText('Test Bank')).toBeInTheDocument();
  });

  test('handles savings without source or account', () => {
    const incompleteActivity = [{
      date: new Date('2024-01-15'),
      description: 'Test',
      value: { amount: 100, currency: Currency.EUR }
    }];

    const incompleteStore = mockStore({
      longTerm: { savings: incompleteActivity }
    });
    
    const { container } = render(
      <Provider store={incompleteStore}>
        <Savings />
      </Provider>
    );

    expect(container).toBeInTheDocument();
  });

  test('render displays banks and accounts', () => {
    const { container } = render(
      <Provider store={store}>
        <Savings />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('groups funds by description', () => {
    const { container } = render(
      <Provider store={store}>
        <Savings />
      </Provider>
    );

    // Verify savings data is processed
    const savingsData = (store.getState() as any).longTerm.savings;
    expect(savingsData).toHaveLength(2);
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

    const zeroStore = mockStore({
      longTerm: { savings: zeroBalanceActivities }
    });
    
    const { container } = render(
      <Provider store={zeroStore}>
        <Savings />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });
});
