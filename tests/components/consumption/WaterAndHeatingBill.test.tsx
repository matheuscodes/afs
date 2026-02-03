import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaterAndHeatingBill from '../../../src/components/consumption/WaterAndHeatingBill';
import { Currency } from '../../../src/models/Activity';

describe('WaterAndHeatingBill', () => {
  const mockBill = {
    cold: {
      base: 50,
      consumption: 20,
      cost: {
        total: { amount: 45.50, currency: Currency.EUR }
      }
    },
    warm: {
      base: 50,
      consumption: 15,
      cost: {
        total: { amount: 38.25, currency: Currency.EUR }
      }
    },
    heaters: [
      {
        location: 'Living Room',
        base: 25,
        consumption: 100,
        cost: {
          total: { amount: 120.00, currency: Currency.EUR }
        }
      },
      {
        location: 'Bedroom',
        base: 20,
        consumption: 80,
        cost: {
          total: { amount: 95.00, currency: Currency.EUR }
        }
      }
    ],
    cost: {
      total: { amount: 298.75, currency: Currency.EUR }
    },
    payments: {
      sum: { amount: 250.00, currency: Currency.EUR }
    }
  };

  test('renders bill component', () => {
    const { container } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    expect(container).toBeInTheDocument();
  });

  test('displays year in title', () => {
    const { getByText } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    expect(getByText(/Water and Heating bill 2024/)).toBeInTheDocument();
  });

  test('displays cold water information', () => {
    const { getByText } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    expect(getByText(/Cold water/)).toBeInTheDocument();
    expect(getByText(/20m³/)).toBeInTheDocument();
  });

  test('displays warm water information', () => {
    const { getByText } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    expect(getByText(/Warm water/)).toBeInTheDocument();
    expect(getByText(/15m³/)).toBeInTheDocument();
  });

  test('displays heaters information', () => {
    const { getByText } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    expect(getByText(/Heaters/)).toBeInTheDocument();
    expect(getByText(/Living Room/)).toBeInTheDocument();
    expect(getByText(/Bedroom/)).toBeInTheDocument();
  });

  test('displays total costs', () => {
    const { container } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    expect(container.textContent).toContain('Total costs');
    expect(container.textContent).toContain('298.75');
    expect(container.textContent).toContain('€');
  });

  test('displays payments when available', () => {
    const { container } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    expect(container.textContent).toContain('Total payment');
    expect(container.textContent).toContain('250.00');
    expect(container.textContent).toContain('€');
  });

  test('calculates bill balance when payments available', () => {
    const { getByText } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    const balance = mockBill.cost.total.amount - mockBill.payments.sum.amount;
    expect(getByText(new RegExp(balance.toFixed(2)))).toBeInTheDocument();
  });

  test('handles bill without payments', () => {
    const billWithoutPayments = { ...mockBill };
    delete billWithoutPayments.payments;
    const { container } = render(<WaterAndHeatingBill bill={billWithoutPayments} year={2024} />);
    expect(container).toBeInTheDocument();
  });

  test('handles bill without cold water', () => {
    const billWithoutCold = { ...mockBill };
    delete billWithoutCold.cold;
    const { container } = render(<WaterAndHeatingBill bill={billWithoutCold} year={2024} />);
    expect(container).toBeInTheDocument();
  });

  test('handles bill without warm water', () => {
    const billWithoutWarm = { ...mockBill };
    delete billWithoutWarm.warm;
    const { container } = render(<WaterAndHeatingBill bill={billWithoutWarm} year={2024} />);
    expect(container).toBeInTheDocument();
  });

  test('handles bill without heaters', () => {
    const billWithoutHeaters = { ...mockBill };
    delete billWithoutHeaters.heaters;
    const { container } = render(<WaterAndHeatingBill bill={billWithoutHeaters} year={2024} />);
    expect(container).toBeInTheDocument();
  });

  test('displays base area for cold water', () => {
    const { getAllByText } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    const matches = getAllByText(/50m²/);
    expect(matches.length).toBeGreaterThan(0);
  });

  test('displays base area for heaters', () => {
    const { getByText } = render(<WaterAndHeatingBill bill={mockBill} year={2024} />);
    expect(getByText(/25m²/)).toBeInTheDocument();
    expect(getByText(/20m²/)).toBeInTheDocument();
  });

  test('handles cold water without base', () => {
    const billWithoutBase = {
      ...mockBill,
      cold: { ...mockBill.cold, base: undefined as any }
    };
    const { container } = render(<WaterAndHeatingBill bill={billWithoutBase} year={2024} />);
    expect(container).toBeInTheDocument();
  });

  test('handles warm water without base', () => {
    const billWithoutBase = {
      ...mockBill,
      warm: { ...mockBill.warm, base: undefined as any }
    };
    const { container } = render(<WaterAndHeatingBill bill={billWithoutBase} year={2024} />);
    expect(container).toBeInTheDocument();
  });

  test('handles heater without base', () => {
    const billWithoutHeaterBase = {
      ...mockBill,
      heaters: [{ ...mockBill.heaters[0], base: undefined as any }]
    };
    const { container } = render(<WaterAndHeatingBill bill={billWithoutHeaterBase} year={2024} />);
    expect(container).toBeInTheDocument();
  });
});
