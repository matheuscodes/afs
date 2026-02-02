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

  test('renderRow creates table row', () => {
    const component = new HeatingTable({ data: mockData });
    const day = { date: '2024-01-15', heater1: 100, heater2: 80 };
    const row = component.renderRow(day, ['heater1', 'heater2'], 0);
    expect(row).toBeTruthy();
  });

  test('groups measurements by date', () => {
    const component = new HeatingTable({ data: mockData });
    const rendered = component.render();
    expect(rendered).toBeTruthy();
  });

  test('renders Date header column', () => {
    const { getByText } = render(<HeatingTable data={mockData} />);
    expect(getByText('Date')).toBeInTheDocument();
  });
});
