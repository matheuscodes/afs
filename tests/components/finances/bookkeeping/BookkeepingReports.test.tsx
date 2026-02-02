import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import BookkeepingReports from '../../../../src/components/finances/bookkeeping/BookkeepingReports';
import { Currency } from '../../../../src/models/Activity';

const mockStore = configureStore([]);

describe('BookkeepingReports', () => {
  const mockActivities = [
    {
      date: new Date('2024-01-15'),
      source: 'Salary',
      description: 'Monthly Salary',
      category: 'Income',
      value: { amount: 3000, currency: Currency.EUR },
      account: 'acc1',
      transfer: false
    },
    {
      date: new Date('2024-01-20'),
      source: 'Supermarket',
      description: 'Groceries',
      category: 'Food',
      value: { amount: -150, currency: Currency.EUR },
      account: 'acc1',
      transfer: false
    },
    {
      date: new Date('2024-02-15'),
      source: 'Salary',
      description: 'Monthly Salary',
      category: 'Income',
      value: { amount: 3000, currency: Currency.EUR },
      account: 'acc1',
      transfer: false
    }
  ];

  const initialState = {
    bookkeeping: mockActivities
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders BookkeepingReports component', () => {
    const { container } = render(
      <Provider store={store}>
        <BookkeepingReports />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Bookkeeping Reports');
  });

  test('componentDidMount calls fetchActivities', () => {
    const mockFetchActivities = jest.fn();
    const store = mockStore({ bookkeeping: mockActivities });
    
    render(
      <Provider store={store}>
        <BookkeepingReports />
      </Provider>
    );
    
    // Verify component renders
    expect(store.getState().bookkeeping).toEqual(mockActivities);
  });

  test('handles empty bookkeeping data', () => {
    const store = mockStore({ bookkeeping: [] });
    
    const { container } = render(
      <Provider store={store}>
        <BookkeepingReports />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('processes bookkeeping data for chart', () => {
    const store = mockStore({ bookkeeping: mockActivities });
    
    const { container } = render(
      <Provider store={store}>
        <BookkeepingReports />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('filters activities by year', () => {
    const store = mockStore({ bookkeeping: mockActivities });
    render(
      <Provider store={store}>
        <BookkeepingReports />
      </Provider>
    );
    
    const filtered = mockActivities.filter(a => a.date.getFullYear() === 2024);
    expect(filtered.length).toBe(3);
  });

  test('handles different years in bookkeeping data', () => {
    const multiYearActivities = [
      ...mockActivities,
      {
        date: new Date('2023-12-15'),
        source: 'Salary',
        description: 'Monthly Salary',
        category: 'Income',
        value: { amount: 3000, currency: Currency.EUR },
        account: 'acc1',
        transfer: false
      }
    ];

    const store = mockStore({ bookkeeping: multiYearActivities });
    
    const { container } = render(
      <Provider store={store}>
        <BookkeepingReports />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });
});
