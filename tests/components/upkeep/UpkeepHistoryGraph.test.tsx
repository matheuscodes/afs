import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpkeepHistoryGraph from '../../../src/components/upkeep/UpkeepHistoryGraph';
import { Currency } from '../../../src/models/Activity';

// Mock Chart.js to avoid canvas issues in tests
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Chart</div>
}));

describe('UpkeepHistoryGraph', () => {
  const mockData = [
    {
      year: 2024,
      period: 'H1',
      groceries: [
        { calories: 2000, price: { amount: 50, currency: Currency.EUR } }
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
    },
    {
      year: 2024,
      period: 'H2',
      groceries: [
        { calories: 2100, price: { amount: 55, currency: Currency.EUR } }
      ],
      pet: {
        food: { amount: 32, currency: Currency.EUR },
        taxes: { amount: 20, currency: Currency.EUR },
        vet: { amount: 40, currency: Currency.EUR },
        insurance: { amount: 15, currency: Currency.EUR }
      },
      housing: {
        area: 100,
        cost: { amount: 820, currency: Currency.EUR },
        electricity: { amount: 65, currency: Currency.EUR },
        gas: { amount: 45, currency: Currency.EUR },
        internet: { amount: 30, currency: Currency.EUR },
        services: { amount: 20, currency: Currency.EUR }
      },
      car: {
        maintenance: { amount: 120, currency: Currency.EUR },
        insurance: { amount: 80, currency: Currency.EUR },
        fuel: { amount: 1.6, currency: Currency.EUR },
        consumption: 7.8
      },
      salary: { amount: 3200, currency: Currency.EUR },
      savings: { amount: 550, currency: Currency.EUR }
    }
  ];

  test('renders UpkeepHistoryGraph component', () => {
    const { container } = render(<UpkeepHistoryGraph data={mockData} />);
    expect(container).toBeInTheDocument();
  });

  test('renders Line chart', () => {
    const { getByTestId } = render(<UpkeepHistoryGraph data={mockData} />);
    expect(getByTestId('line-chart')).toBeInTheDocument();
  });

  test('handles empty data', () => {
    const { container } = render(<UpkeepHistoryGraph data={[]} />);
    expect(container).toBeInTheDocument();
  });

  test('handles null data', () => {
    const { container } = render(<UpkeepHistoryGraph data={null} />);
    expect(container).toBeInTheDocument();
  });

  test('processes upkeep data for chart', () => {
    const component = new UpkeepHistoryGraph({ data: mockData });
    const { container } = render(component.render());
    expect(container).toBeInTheDocument();
  });

  test('handles data with missing car information', () => {
    const dataWithoutCar = [{
      ...mockData[0],
      car: undefined as any
    }];
    const { container } = render(<UpkeepHistoryGraph data={dataWithoutCar} />);
    expect(container).toBeInTheDocument();
  });

  test('handles data with missing savings', () => {
    const dataWithoutSavings = [{
      ...mockData[0],
      savings: undefined as any
    }];
    const { container } = render(<UpkeepHistoryGraph data={dataWithoutSavings} />);
    expect(container).toBeInTheDocument();
  });

  test('handles data with car km pricing', () => {
    const dataWithKmPricing = [{
      ...mockData[0],
      car: {
        ...mockData[0].car,
        fuel: undefined as any,
        km: 10000,
        kmPrice: { amount: 0.5, currency: Currency.EUR }
      }
    }];
    const { container } = render(<UpkeepHistoryGraph data={dataWithKmPricing} />);
    expect(container).toBeInTheDocument();
  });

  test('renders with single data point', () => {
    const singleDataPoint = [mockData[0]];
    const { container } = render(<UpkeepHistoryGraph data={singleDataPoint} />);
    expect(container).toBeInTheDocument();
  });

  test('renders with multiple data points', () => {
    const { container } = render(<UpkeepHistoryGraph data={mockData} />);
    expect(container).toBeInTheDocument();
  });
});
