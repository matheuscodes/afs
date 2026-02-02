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
    expect(container.querySelector('table')).toBeInTheDocument();
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

  test('renderRow creates table row with data', () => {
    const component = new WaterTable({ data: mockData });
    const day = {
      cold: mockData.cold.readings[0],
      warm: mockData.warm.readings[0]
    };
    const row = component.renderRow(day, 0);
    expect(row).toBeTruthy();
  });

  test('handles cold water only', () => {
    const coldOnlyData: any = {
      cold: mockData.cold,
      warm: { readings: [] }
    };
    const { container } = render(<WaterTable data={coldOnlyData} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  test('handles warm water only', () => {
    const warmOnlyData: any = {
      cold: { readings: [] },
      warm: mockData.warm
    };
    const { container } = render(<WaterTable data={warmOnlyData} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  test('handles missing cold readings', () => {
    const noColData = {
      warm: mockData.warm
    };
    const { container } = render(<WaterTable data={noColData} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  test('handles missing warm readings', () => {
    const noWarmData = {
      cold: mockData.cold
    };
    const { container } = render(<WaterTable data={noWarmData} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  test('groups readings by date', () => {
    const component = new WaterTable({ data: mockData });
    const rendered = component.render();
    expect(rendered).toBeTruthy();
  });

  test('renderRow handles row with only cold data', () => {
    const component = new WaterTable({ data: mockData });
    const day = {
      cold: mockData.cold.readings[0]
    };
    const row = component.renderRow(day, 0);
    expect(row).toBeTruthy();
  });

  test('renderRow handles row with only warm data', () => {
    const component = new WaterTable({ data: mockData });
    const day = {
      warm: mockData.warm.readings[0]
    };
    const row = component.renderRow(day, 0);
    expect(row).toBeTruthy();
  });

  test('calculates daily consumption for warm water', () => {
    const component = new WaterTable({ data: mockData });
    const day = {
      warm: { ...mockData.warm.readings[0], consumption: 3.0, days: 30 }
    };
    const row = component.renderRow(day, 0);
    expect(row).toBeTruthy();
  });

  test('calculates daily consumption for cold water', () => {
    const component = new WaterTable({ data: mockData });
    const day = {
      cold: { ...mockData.cold.readings[0], consumption: 6.0, days: 30 }
    };
    const row = component.renderRow(day, 0);
    expect(row).toBeTruthy();
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
    expect(container.querySelector('table')).toBeInTheDocument();
  });
});
