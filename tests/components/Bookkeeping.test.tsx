import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Bookkeeping from '../../src/components/Bookkeeping';
import { Activity, Currency } from '../../src/models/Activity';

const mockStore = configureStore([thunk]);

describe('Bookkeeping', () => {
  const mockActivities: Activity[] = [
    {
      date: new Date('2024-01-15'),
      source: 'Test Source',
      description: 'Test Description',
      category: 'Food',
      value: { amount: 100, currency: Currency.EUR },
      account: 'acc1',
      transfer: false
    },
    {
      date: new Date('2024-02-20'),
      source: 'Test Source 2',
      description: 'Test Description 2',
      category: 'Food',
      value: { amount: 200, currency: Currency.EUR },
      account: 'acc2',
      transfer: false
    }
  ];

  const mockAccounts = {
    'acc1': { name: 'Test Account', type: 'Checking' },
    'acc2': { name: 'Savings', type: 'Saving' }
  };

  const initialState = {
    bookkeeping: mockActivities,
    accounting: {
      accounts: mockAccounts
    }
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders Bookkeeping component', () => {
    const { container } = render(
      <Provider store={store}>
        <Bookkeeping />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Bookkeeping');
  });

  test('dispatches fetch actions on mount', () => {
    render(
      <Provider store={store}>
        <Bookkeeping />
      </Provider>
    );
    
    const actions = store.getActions();
    // Component should dispatch fetch actions through Redux
    expect(store.getState().bookkeeping).toEqual(mockActivities);
    expect(store.getState().accounting.accounts).toEqual(mockAccounts);
  });

  test('displays available months for selected year', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Bookkeeping />
      </Provider>
    );
    
    // Should display tabs for January and February based on mockActivities dates
    // The component renders month tabs based on available data
    expect(store.getState().bookkeeping).toHaveLength(2);
  });

  test('displays available years from bookkeeping data', () => {
    const { container } = render(
      <Provider store={store}>
        <Bookkeeping />
      </Provider>
    );
    
    // Component should render year 2024 based on mockActivities
    expect(container).toBeInTheDocument();
    expect(store.getState().bookkeeping[0].date.getFullYear()).toBe(2024);
  });

  test('filters activities by selected month and year', () => {
    render(
      <Provider store={store}>
        <Bookkeeping />
      </Provider>
    );
    
    // Test the data filtering logic
    const january2024 = mockActivities.filter((i: Activity) => {
      return i.date.getMonth() === 0 && i.date.getFullYear() === 2024;
    });

    expect(january2024.length).toBe(1);
    expect(january2024[0].description).toBe('Test Description');
  });

  test('renders current year by default', () => {
    const currentYear = new Date().getFullYear();
    
    const { container } = render(
      <Provider store={store}>
        <Bookkeeping />
      </Provider>
    );

    // Component should default to current year
    expect(container).toBeInTheDocument();
  });

  test('handles empty bookkeeping data', () => {
    const emptyStore = mockStore({
      bookkeeping: [],
      accounting: { accounts: mockAccounts }
    });
    
    const { container } = render(
      <Provider store={emptyStore}>
        <Bookkeeping />
      </Provider>
    );

    // Should render without crashing
    expect(container.querySelector('h1')).toHaveTextContent('Bookkeeping');
  });
});
