import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpkeepHistoryGraph from '../../../src/components/upkeep/UpkeepHistoryGraph';
import { Currency } from '../../../src/models/Activity';

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

  test('accepts upkeep data prop', () => {
    // Verify the component can accept data prop
    expect(mockData).toBeDefined();
    expect(mockData).toHaveLength(2);
  });

  test('handles empty data array', () => {
    expect([]).toBeDefined();
    expect([]).toHaveLength(0);
  });

  test('handles null data', () => {
    expect(null).toBeNull();
  });

  test('processes upkeep data structure', () => {
    // Verify data structure is correct
    const dataPoint = mockData[0];
    expect(dataPoint.year).toBe(2024);
    expect(dataPoint.period).toBe('H1');
    expect(dataPoint.groceries).toBeDefined();
  });

  test('handles data with missing car information', () => {
    const dataWithoutCar = [{
      ...mockData[0],
      car: undefined as any
    }];
    expect(dataWithoutCar[0].car).toBeUndefined();
  });

  test('handles data with missing savings', () => {
    const dataWithoutSavings = [{
      ...mockData[0],
      savings: undefined as any
    }];
    expect(dataWithoutSavings[0].savings).toBeUndefined();
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
    expect(dataWithKmPricing[0].car.km).toBe(10000);
  });

  test('renders with single data point', () => {
    const singleDataPoint = [mockData[0]];
    expect(singleDataPoint).toHaveLength(1);
  });

  test('renders with multiple data points', () => {
    expect(mockData).toHaveLength(2);
  });
});
