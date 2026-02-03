import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaterTable from '../../../src/components/consumption/WaterTable';

describe('WaterTable', () => {
  const mockData = {
    cold: {
      readings: [
        { date: '2024-01-15', measurement: 100.5, consumption: 5.5, days: 30 },
        { date: '2024-02-15', measurement: 106.0, consumption: 5.5, days: 31 }
      ]
    },
    warm: {
      readings: [
        { date: '2024-01-15', measurement: 50.2, consumption: 3.2, days: 30 },
        { date: '2024-02-15', measurement: 53.4, consumption: 3.2, days: 31 }
      ]
    }
  };

  test('renders water table with data', () => {
    const { container } = render(<WaterTable data={mockData} />);
    const tableBody = container.querySelector('[data-evergreen-table-body]');
    expect(tableBody).toBeInTheDocument();
  });

  test('displays table headers', () => {
    const { getByText } = render(<WaterTable data={mockData} />);
    expect(getByText('Date')).toBeInTheDocument();
    expect(getByText('Days')).toBeInTheDocument();
    expect(getByText('Reading warm')).toBeInTheDocument();
    expect(getByText('Reading cold')).toBeInTheDocument();
    expect(getByText('Warm per day')).toBeInTheDocument();
    expect(getByText('Cold per day')).toBeInTheDocument();
  });

  test('renders rows for each date', () => {
    const { getByText } = render(<WaterTable data={mockData} />);
    expect(getByText('2024-01-15')).toBeInTheDocument();
    expect(getByText('2024-02-15')).toBeInTheDocument();
  });



  test('handles readings without days', () => {
    const dataWithoutDays = {
      cold: {
        readings: [
          { date: '2024-01-15', measurement: 100.5, consumption: 5.5 }
        ]
      },
      warm: {
        readings: [
          { date: '2024-01-15', measurement: 50.2, consumption: 3.2 }
        ]
      }
    };
    const { container } = render(<WaterTable data={dataWithoutDays} />);
    const tableBody = container.querySelector('[data-evergreen-table-body]');
    expect(tableBody).toBeInTheDocument();
  });
});
