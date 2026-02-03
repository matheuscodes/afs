import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeatingTable from '../../../src/components/consumption/HeatingTable';

describe('HeatingTable', () => {
  const mockData = {
    heating: {
      heaters: {
        'heater1': {
          id: 'heater1',
          location: 'Living Room',
          readings: [
            { date: '2024-01-15', measurement: 100 },
            { date: '2024-02-15', measurement: 150 }
          ]
        },
        'heater2': {
          id: 'heater2',
          location: 'Bedroom',
          readings: [
            { date: '2024-01-15', measurement: 80 },
            { date: '2024-02-15', measurement: 120 }
          ]
        }
      }
    }
  };

  test('renders heating table with data', () => {
    const { container } = render(<HeatingTable data={mockData} />);
    const table = container.querySelector('[data-evergreen-table-body]');
    expect(table).toBeInTheDocument();
  });

  test('displays heater locations in headers', () => {
    const { getByText } = render(<HeatingTable data={mockData} />);
    expect(getByText(/Living Room/)).toBeInTheDocument();
    expect(getByText(/Bedroom/)).toBeInTheDocument();
  });

  test('displays heater IDs in headers', () => {
    const { getByText } = render(<HeatingTable data={mockData} />);
    expect(getByText(/heater1/)).toBeInTheDocument();
    expect(getByText(/heater2/)).toBeInTheDocument();
  });

  test('renders rows for each date', () => {
    const { getByText } = render(<HeatingTable data={mockData} />);
    expect(getByText('2024-01-15')).toBeInTheDocument();
    expect(getByText('2024-02-15')).toBeInTheDocument();
  });



  test('renders Date header column', () => {
    const { getByText } = render(<HeatingTable data={mockData} />);
    expect(getByText('Date')).toBeInTheDocument();
  });
});
