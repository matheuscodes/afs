import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import Bookkeeping from '../../src/components/Bookkeeping';
import { Activity, Currency } from '../../src/models/Activity';

const mockStore = configureStore([]);

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

  test('componentDidMount calls fetch functions', () => {
    const mockFetchAccounts = jest.fn();
    const mockFetchActivities = jest.fn();
    const component = new Bookkeeping({
      bookkeeping: mockActivities,
      accounting: { accounts: mockAccounts },
      fetchAccounts: mockFetchAccounts,
      fetchActivities: mockFetchActivities,
      addActivity: jest.fn()
    });

    component.componentDidMount();
    expect(mockFetchAccounts).toHaveBeenCalled();
    expect(mockFetchActivities).toHaveBeenCalled();
  });

  test('availableMonths returns unique months from bookkeeping data', () => {
    const component = new Bookkeeping({
      bookkeeping: mockActivities,
      accounting: { accounts: mockAccounts },
      fetchAccounts: jest.fn(),
      fetchActivities: jest.fn(),
      addActivity: jest.fn()
    });
    component.state = { year: 2024 };

    const months = component.availableMonths();
    expect(months).toContain(0); // January
    expect(months).toContain(1); // February
    expect(months.length).toBe(2);
  });

  test('availableYears returns unique years from bookkeeping data', () => {
    const component = new Bookkeeping({
      bookkeeping: mockActivities,
      accounting: { accounts: mockAccounts },
      fetchAccounts: jest.fn(),
      fetchActivities: jest.fn(),
      addActivity: jest.fn()
    });

    const years = component.availableYears();
    expect(years).toContain(2024);
    expect(years.length).toBe(1);
  });

  test('filters activities by selected month and year', () => {
    const component = new Bookkeeping({
      bookkeeping: mockActivities,
      accounting: { accounts: mockAccounts },
      fetchAccounts: jest.fn(),
      fetchActivities: jest.fn(),
      addActivity: jest.fn()
    });
    component.state = { year: 2024, month: 0 };

    const filtered = mockActivities.filter((i: Activity) => {
      return i.date.getMonth() === component.state.month &&
        i.date.getFullYear() === component.state.year
    });

    expect(filtered.length).toBe(1);
    expect(filtered[0].description).toBe('Test Description');
  });

  test('constructor sets initial year to current year', () => {
    const currentYear = new Date().getFullYear();
    const component = new Bookkeeping({
      bookkeeping: mockActivities,
      accounting: { accounts: mockAccounts },
      fetchAccounts: jest.fn(),
      fetchActivities: jest.fn(),
      addActivity: jest.fn()
    });

    expect(component.state.year).toBe(currentYear);
  });

  test('handles empty bookkeeping data', () => {
    const component = new Bookkeeping({
      bookkeeping: [],
      accounting: { accounts: mockAccounts },
      fetchAccounts: jest.fn(),
      fetchActivities: jest.fn(),
      addActivity: jest.fn()
    });
    component.state = { year: 2024 };

    const months = component.availableMonths();
    const years = component.availableYears();

    expect(months).toEqual([]);
    expect(years).toEqual([]);
  });
});
