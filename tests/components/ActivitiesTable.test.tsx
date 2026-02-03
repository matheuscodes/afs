import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivitiesTable from '../../src/components/ActivitiesTable';

describe('ActivitiesTable', () => {
  const mockAccounts = {
    'acc1': { name: 'Test Account', type: 'Checking' },
    'acc2': { name: 'Savings', type: 'Saving' }
  };

  const mockData = [
    {
      date: new Date('2024-01-15'),
      source: 'Test Source',
      description: 'Test Description',
      category: 'Food',
      value: { amount: 100, currency: 'EUR' },
      account: 'acc1',
      transfer: false
    },
    {
      date: new Date('2024-01-20'),
      source: 'acc2',
      description: 'Transfer',
      value: { amount: 200, currency: 'EUR' },
      account: 'acc1',
      transfer: true
    }
  ];

  test('renders table with data', () => {
    render(<ActivitiesTable data={mockData} accounts={mockAccounts} />);
    expect(screen.getByText(/Test Description/)).toBeInTheDocument();
  });

  test('sorts data in descending order by default', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.state = {
      searchQuery: { source: '', description: '' },
      orderedColumn: "date",
      ordering: 'DESC'
    };
    const sorted = component.sort(mockData);
    expect(sorted[0].date >= sorted[1].date).toBe(true);
  });

  test('sorts data in ascending order', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.state = {
      searchQuery: { source: '', description: '' },
      orderedColumn: "date",
      ordering: 'ASC'
    };
    const sorted = component.sort(mockData);
    expect(sorted[0].date <= sorted[1].date).toBe(true);
  });

  test('filters by source query', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.state = {
      searchQuery: { source: 'Test', description: '' },
      orderedColumn: "date",
      ordering: 'DESC'
    };
    const filtered = component.filter(mockData);
    expect(filtered.length).toBe(1);
    expect(filtered[0].source).toBe('Test Source');
  });

  test('filters by description query', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.state = {
      searchQuery: { source: '', description: 'Transfer' },
      orderedColumn: "date",
      ordering: 'DESC'
    };
    const filtered = component.filter(mockData);
    expect(filtered.length).toBe(1);
    expect(filtered[0].description).toBe('Transfer');
  });

  test('filters by description including category', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.state = {
      searchQuery: { source: '', description: 'Food' },
      orderedColumn: "date",
      ordering: 'DESC'
    };
    const filtered = component.filter(mockData);
    expect(filtered.length).toBe(1);
    expect(filtered[0].category).toBe('Food');
  });

  test('returns all data when no filter query', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.state = {
      searchQuery: { source: '', description: '' },
      orderedColumn: "date",
      ordering: 'DESC'
    };
    const filtered = component.filter(mockData);
    expect(filtered.length).toBe(2);
  });

  test('handleFilterChange updates state', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.setState = jest.fn();
    component.handleFilterChange('test', 'source');
    expect(component.state.searchQuery.source).toBe('test');
  });

  test('renders sortable header cells', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    const headerCell = component.renderSortableTableHeaderCell('date', 'Date');
    expect(headerCell).toBeTruthy();
  });

  test('renders row menu', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    const menu = component.renderRowMenu();
    expect(menu).toBeTruthy();
  });

  test('renders row with activity data', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    const row = component.renderRow({ activity: mockData[0], index: 0 });
    expect(row).toBeTruthy();
  });

  test('handles transfer activity in row rendering', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    const row = component.renderRow({ activity: mockData[1], index: 1 });
    expect(row).toBeTruthy();
  });

  test('handles activity without account', () => {
    const dataWithoutAccount = [{
      ...mockData[0],
      account: 'unknown'
    }];
    const component = new ActivitiesTable({ data: dataWithoutAccount, accounts: mockAccounts });
    const row = component.renderRow({ activity: dataWithoutAccount[0], index: 0 });
    expect(row).toBeTruthy();
  });

  test('getIconForOrder returns correct icons', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    const ascIcon = component.getIconForOrder('ASC');
    const descIcon = component.getIconForOrder('DESC');
    const noneIcon = component.getIconForOrder('NONE');
    expect(ascIcon).toBeTruthy();
    expect(descIcon).toBeTruthy();
    expect(noneIcon).toBeTruthy();
  });

  test('sorts by value amount when column is value', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.state = {
      searchQuery: { source: '', description: '' },
      orderedColumn: "value",
      ordering: 'ASC'
    };
    const sorted = component.sort(mockData);
    expect(sorted[0].value.amount).toBeLessThanOrEqual(sorted[1].value.amount);
  });

  test('returns original data when ordering is NONE', () => {
    const component = new ActivitiesTable({ data: mockData, accounts: mockAccounts });
    component.state = {
      searchQuery: { source: '', description: '' },
      orderedColumn: "date",
      ordering: 'NONE'
    };
    const sorted = component.sort(mockData);
    expect(sorted).toEqual(mockData);
  });
});
