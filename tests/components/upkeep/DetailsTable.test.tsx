import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailsTable from '../../../src/components/upkeep/DetailsTable';
import { Currency } from '../../../src/models/Activity';

describe('DetailsTable', () => {
  const mockData = [
    {
      year: 2024,
      period: 'H1',
      value: 1000,
      count: 5
    },
    {
      year: 2024,
      period: 'H2',
      value: 1200,
      count: 6
    }
  ];

  const mockColumns = {
    'Value': (half: any) => <div>{half.value}</div>,
    'Count': (half: any) => <div>{half.count}</div>
  };

  test('renders DetailsTable with data', () => {
    const { container } = render(
      <DetailsTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
      />
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  test('displays table title', () => {
    const { getByText } = render(
      <DetailsTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
      />
    );
    expect(getByText('Test Table')).toBeInTheDocument();
  });

  test('displays Period header', () => {
    const { getByText } = render(
      <DetailsTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
      />
    );
    expect(getByText('Period')).toBeInTheDocument();
  });

  test('displays column headers', () => {
    const { getByText } = render(
      <DetailsTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
      />
    );
    expect(getByText('Value')).toBeInTheDocument();
    expect(getByText('Count')).toBeInTheDocument();
  });

  test('renders rows for each data item', () => {
    const { getByText } = render(
      <DetailsTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
      />
    );
    expect(getByText('2024H1')).toBeInTheDocument();
    expect(getByText('2024H2')).toBeInTheDocument();
  });

  test('renderRow creates table row', () => {
    const component = new DetailsTable({
      title: 'Test Table',
      columns: mockColumns,
      data: mockData
    });

    const row = component.renderRow(mockData[0], 0);
    expect(row).toBeTruthy();
  });

  test('applies column functions to data', () => {
    const { getByText } = render(
      <DetailsTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
      />
    );
    expect(getByText('1000')).toBeInTheDocument();
    expect(getByText('1200')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('6')).toBeInTheDocument();
  });

  test('handles empty data array', () => {
    const { container } = render(
      <DetailsTable
        title="Test Table"
        columns={mockColumns}
        data={[]}
      />
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  test('handles single column', () => {
    const singleColumn = {
      'Value': (half: any) => <div>{half.value}</div>
    };
    const { getByText } = render(
      <DetailsTable
        title="Test Table"
        columns={singleColumn}
        data={mockData}
      />
    );
    expect(getByText('Value')).toBeInTheDocument();
  });

  test('handles multiple columns', () => {
    const multipleColumns = {
      'Col1': (half: any) => <div>A</div>,
      'Col2': (half: any) => <div>B</div>,
      'Col3': (half: any) => <div>C</div>
    };
    const { getByText } = render(
      <DetailsTable
        title="Test Table"
        columns={multipleColumns}
        data={mockData}
      />
    );
    expect(getByText('Col1')).toBeInTheDocument();
    expect(getByText('Col2')).toBeInTheDocument();
    expect(getByText('Col3')).toBeInTheDocument();
  });

  test('renders summary when provided', () => {
    const summary = <td>Total: 100</td>;
    const component = new DetailsTable({
      title: 'Test Table',
      columns: mockColumns,
      data: mockData,
      summary: summary
    });

    const row = component.renderRow(mockData[0], 0);
    expect(row).toBeTruthy();
  });

  test('handles complex column functions', () => {
    const complexColumns = {
      'Calculated': (half: any) => <strong>{half.value * 2}</strong>
    };
    const { container } = render(
      <DetailsTable
        title="Test Table"
        columns={complexColumns}
        data={mockData}
      />
    );
    expect(container.querySelector('strong')).toBeInTheDocument();
  });
});
