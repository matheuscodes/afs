import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonthlyActivityOverview from '../../src/components/MonthlyActivityOverview';
import { Currency } from '../../src/models/Activity';

describe('MonthlyActivityOverview', () => {
  const mockData = {
    lastMonth: {
      checking: { amount: 1000, currency: Currency.EUR },
      credit: { amount: -500, currency: Currency.EUR },
      cash: { amount: 200, currency: Currency.EUR }
    },
    total: {
      expenses: { amount: 800, currency: Currency.EUR },
      income: { amount: 2000, currency: Currency.EUR }
    },
    current: {
      checking: { amount: 1200, currency: Currency.EUR },
      credit: { amount: -300, currency: Currency.EUR },
      cash: { amount: 150, currency: Currency.EUR }
    },
    accounts: {
      Checking: [
        { name: 'Main Account', balance: { amount: 1000, currency: Currency.EUR } }
      ],
      Saving: [
        { name: 'Emergency Fund', balance: { amount: 5000, currency: Currency.EUR } }
      ]
    },
    categorized: {
      'Food': { amount: 300, currency: Currency.EUR },
      'Transport': { amount: 100, currency: Currency.EUR },
      'Entertainment': { amount: 50, currency: Currency.EUR }
    }
  };

  test('renders overview table with data', () => {
    const { container } = render(<MonthlyActivityOverview data={mockData} />);
    const table = container.querySelector('[data-evergreen-table-body]');
    expect(table).toBeInTheDocument();
  });

  test('displays last balance in checking accounts', () => {
    const { getAllByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getAllByText(/Last Balance in Checking Accounts/)[0]).toBeInTheDocument();
    const balanceElements = getAllByText('1000.00 €');
    expect(balanceElements.length).toBeGreaterThanOrEqual(1);
  });

  test('displays last balance in credit accounts', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getByText(/Last Balance in Credit Accounts/)).toBeInTheDocument();
    expect(getByText('-500.00 €')).toBeInTheDocument();
  });

  test('displays last balance in cash', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getByText(/Last Balance in Cash/)).toBeInTheDocument();
    expect(getByText('200.00 €')).toBeInTheDocument();
  });

  test('displays total expenses', () => {
    const { getAllByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getAllByText(/Total Expenses/)[0]).toBeInTheDocument();
    const expenseElements = getAllByText('800.00 €');
    expect(expenseElements.length).toBeGreaterThanOrEqual(1);
  });

  test('displays total income', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getByText(/Total Income/)).toBeInTheDocument();
    expect(getByText('2000.00 €')).toBeInTheDocument();
  });

  test('displays current checking accounts balance', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getByText(/Checking Accounts Balance/)).toBeInTheDocument();
    expect(getByText('1200.00 €')).toBeInTheDocument();
  });

  test('displays current credit balance', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getByText(/Credit Balance/)).toBeInTheDocument();
    expect(getByText('-300.00 €')).toBeInTheDocument();
  });

  test('displays current cash balance', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getByText(/Cash Balance/)).toBeInTheDocument();
    expect(getByText('150.00 €')).toBeInTheDocument();
  });

  test('renders account type sections', () => {
    const { getAllByText } = render(<MonthlyActivityOverview data={mockData} />);
    const checkingElements = getAllByText(/Checking Accounts/);
    expect(checkingElements.length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/Saving Accounts/)[0]).toBeInTheDocument();
  });

  test('renders individual accounts in account type sections', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getByText(/Main Account/)).toBeInTheDocument();
    expect(getByText(/Emergency Fund/)).toBeInTheDocument();
  });

  test('renders category spending table', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    expect(getByText(/Category Spending/)).toBeInTheDocument();
    expect(getByText(/Food/)).toBeInTheDocument();
    expect(getByText(/Transport/)).toBeInTheDocument();
    expect(getByText(/Entertainment/)).toBeInTheDocument();
  });



  test('renders all category keys from categorized data', () => {
    const { getByText } = render(<MonthlyActivityOverview data={mockData} />);
    const categories = Object.keys(mockData.categorized);
    categories.forEach(category => {
      expect(getByText(category)).toBeInTheDocument();
    });
  });
});
