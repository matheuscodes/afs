import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import ConnectedElectricity, { 
  Electricity,
  dateDifference, 
  paymentsByBill,
  groupedPayments 
} from '../../../src/components/consumption/Electricity';
import { Currency } from '../../../src/models/Activity';
import { updateHomes, updateElectricity, updateGas, updateWater, updateHeating } from '../../../src/actions/consumption/home';

// Mock the HomeService to prevent actual file I/O
jest.mock('../../../src/services/HomeService', () => ({
    fetchHomes: jest.fn(() => updateHomes([])),
    fetchElectricity: jest.fn(() => updateElectricity("1",[],[],[])),
    fetchGas: jest.fn(() => updateGas("1",[],[],[])),
    fetchWater: jest.fn(() => updateWater("1",[],[],[])),
    fetchHeating: jest.fn(() => updateHeating("1",[],[],[])),
}));

const mockStore = configureStore([thunk]);

describe('Electricity Utility Functions', () => {
  describe('dateDifference', () => {
    test('calculates date difference in days', () => {
      const diff = dateDifference('2024-02-01', '2024-01-01');
      expect(diff).toBe(31);
    });

    test('handles negative differences', () => {
      const diff = dateDifference('2024-01-01', '2024-02-01');
      expect(diff).toBe(-31);
    });

    test('handles same dates', () => {
      const diff = dateDifference('2024-01-01', '2024-01-01');
      expect(diff).toBe(0);
    });
  });

  describe('paymentsByBill', () => {
    test('groups payments by bill ID', () => {
      const payments: any = [
        { meter: 'meter1', date: '2024-01-15', value: { amount: 50, currency: Currency.EUR }, bill: 'bill-01' },
        { meter: 'meter1', date: '2024-01-20', value: { amount: 30, currency: Currency.EUR }, bill: 'bill-01' },
        { meter: 'meter1', date: '2024-02-15', value: { amount: 60, currency: Currency.EUR }, bill: 'bill-02' }
      ];

      const result = paymentsByBill(payments);
      expect(Object.keys(result)).toHaveLength(2);
      expect(result['bill-01']).toHaveLength(2);
      expect(result['bill-02']).toHaveLength(1);
    });

    test('handles empty payments array', () => {
      const result = paymentsByBill([]);
      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('groupedPayments', () => {
    test('aggregates payments by bill with date ranges and sums', () => {
      const payments: any = [
        { meter: 'meter1', date: new Date('2024-01-15'), value: { amount: 50, currency: Currency.EUR }, bill: 'bill-01' },
        { meter: 'meter1', date: new Date('2024-01-20'), value: { amount: 30, currency: Currency.EUR }, bill: 'bill-01' }
      ];

      const result = groupedPayments(payments);
      expect(result).toHaveLength(1);
      expect(result[0].sum.amount).toBe(80);
      expect(result[0].bill).toBe('bill-01');
    });

    test('handles empty payments', () => {
      const result = groupedPayments([]);
      expect(result).toHaveLength(0);
    });
  });
});

describe('Electricity Component', () => {
  const mockHomes: any = {
    'home1': {
      id: 'home1',
      name: 'Test Home',
      area: 100,
      water: { warm: {}, cold: {} },
      electricity: {
        'meter1': {
          measurements: [
            { meter: 'meter1', date: '2024-01-01', measurement: 1000, billable: true },
            { meter: 'meter1', date: '2024-02-01', measurement: 1100, billable: true }
          ],
          prices: [
            {
              meter: 'meter1',
              date: '2023-12-31',
              unit: { amount: 0.25, currency: Currency.EUR },
              base: { amount: 10, currency: Currency.EUR }
            }
          ],
          payments: [
            {
              meter: 'meter1',
              date: '2024-01-15',
              value: { amount: 50, currency: Currency.EUR },
              bill: 'bill-2024-01'
            }
          ]
        }
      }
    }
  };

  const initialState = {
    homes: mockHomes
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders Electricity component', () => {
    const { container } = render(
      <Provider store={store}>
        <ConnectedElectricity />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Electricity');
  });

  test('calls fetchHomes on mount', async () => {
    const mockFetchHomes = jest.fn();
    const component = new Electricity({ 
      fetchHomes: mockFetchHomes,
      fetchElectricity: jest.fn(),
      homes: null
    });

    await component.componentDidMount();
    expect(mockFetchHomes).toHaveBeenCalled();
  });

  test('renders home tabs when homes are available', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ConnectedElectricity />
      </Provider>
    );
    
    expect(getByText('Test Home')).toBeInTheDocument();
  });

  test('getPowerMeters processes measurements correctly', () => {
    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomes
    });

    const powerMeter = mockHomes.home1.electricity.meter1;
    const result = component.getPowerMeters(powerMeter);
    
    expect(result).toHaveLength(2);
    expect(result[0].measurement).toBe(1000);
    expect(result[0].consumption).toBe(0);
    expect(result[0].days).toBe(0);
    
    expect(result[1].consumption).toBe(100);
    expect(result[1].days).toBeGreaterThan(0);
  });

  test('getPowerMeters calculates costs correctly', () => {
    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomes
    });

    const powerMeter = mockHomes.home1.electricity.meter1;
    const result = component.getPowerMeters(powerMeter);
    
    expect(result[1].cost).toBeDefined();
    expect(result[1].cost.amount).toBeGreaterThan(0);
    expect(result[1].cost.currency).toBe(Currency.EUR);
  });

  test('getBills processes billable measurements', () => {
    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomes
    });

    const powerMeter = mockHomes.home1.electricity.meter1;
    const bills = component.getBills(powerMeter);
    
    expect(bills).toHaveLength(1);
    expect(bills[0].from).toBeDefined();
    expect(bills[0].to).toBeDefined();
    expect(bills[0].consumption).toBe(100);
  });

  test('getBills calculates costs correctly', () => {
    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomes
    });

    const powerMeter = mockHomes.home1.electricity.meter1;
    const bills = component.getBills(powerMeter);
    
    expect(bills[0].cost.unit).toBeDefined();
    expect(bills[0].cost.base).toBeDefined();
    expect(bills[0].cost.total).toBeDefined();
    expect(bills[0].cost.total.amount).toBeGreaterThan(0);
  });

  test('renderRow creates table row', () => {
    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomes
    });

    const measurementEntry = {
      date: '2024-01-01',
      measurement: 1000,
      consumption: 100,
      days: 31,
      price: {
        unit: { amount: 0.25, currency: Currency.EUR },
        base: { amount: 10, currency: Currency.EUR }
      },
      cost: {
        amount: 335,
        currency: Currency.EUR
      }
    };

    const row = component.renderRow(measurementEntry, 0);
    
    expect(row).toBeDefined();
    expect(row.key).toBe('electricity-0');
  });

  test('renderRow handles first measurement with no consumption', () => {
    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomes
    });

    const measurementEntry = {
      date: '2024-01-01',
      measurement: 1000,
      consumption: 0,
      days: 0,
      price: {
        unit: { amount: 0.25, currency: Currency.EUR },
        base: { amount: 10, currency: Currency.EUR }
      },
      cost: {
        amount: 0,
        currency: Currency.EUR
      }
    };

    const row = component.renderRow(measurementEntry, 0);
    
    expect(row).toBeDefined();
    expect(row.key).toBe('electricity-0');
  });

  test('render returns valid React element', () => {
    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomes
    });

    const renderOutput = component.render();
    
    expect(renderOutput).toBeDefined();
    expect(renderOutput.type).toBe('div');
  });

  test('handles empty homes', () => {
    const emptyStore = mockStore({ homes: null });
    const { container } = render(
      <Provider store={emptyStore}>
        <ConnectedElectricity />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('handles empty electricity measurements', () => {
    const homesWithEmpty: any = {
      'home1': {
        ...mockHomes.home1,
        electricity: {
          'meter1': {
            ...mockHomes.home1.electricity.meter1,
            measurements: []
          }
        }
      }
    };
    
    const emptyStore = mockStore({ homes: homesWithEmpty });
    const { container } = render(
      <Provider store={emptyStore}>
        <ConnectedElectricity />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('getBills handles multiple billable measurements', () => {
    const mockHomesWithMultiple: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        electricity: {
          'meter1': {
            measurements: [
              { meter: 'meter1', date: '2024-01-01', measurement: 1000, billable: true },
              { meter: 'meter1', date: '2024-01-15', measurement: 1050, billable: false },
              { meter: 'meter1', date: '2024-02-01', measurement: 1100, billable: true },
              { meter: 'meter1', date: '2024-03-01', measurement: 1200, billable: true }
            ],
            prices: [
              {
                meter: 'meter1',
                date: '2023-12-31',
                unit: { amount: 0.25, currency: Currency.EUR },
                base: { amount: 10, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomesWithMultiple
    });

    const powerMeter = mockHomesWithMultiple.home1.electricity.meter1;
    const bills = component.getBills(powerMeter);
    
    expect(bills.length).toBeGreaterThan(0);
    bills.forEach(bill => {
      expect(bill.from).toBeDefined();
      expect(bill.to).toBeDefined();
      expect(bill.consumption).toBeGreaterThanOrEqual(0);
    });
  });

  test('getBills handles last measurement even if not billable', () => {
    const mockHomesLastNotBillable: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        electricity: {
          'meter1': {
            measurements: [
              { meter: 'meter1', date: '2024-01-01', measurement: 1000, billable: true },
              { meter: 'meter1', date: '2024-02-01', measurement: 1100, billable: false }
            ],
            prices: [
              {
                meter: 'meter1',
                date: '2023-12-31',
                unit: { amount: 0.25, currency: Currency.EUR },
                base: { amount: 10, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomesLastNotBillable
    });

    const powerMeter = mockHomesLastNotBillable.home1.electricity.meter1;
    const bills = component.getBills(powerMeter);
    
    expect(bills).toHaveLength(1);
  });

  test('getBills skips first billable without previous measurement', () => {
    const mockHomesSingleBillable: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        electricity: {
          'meter1': {
            measurements: [
              { meter: 'meter1', date: '2024-01-01', measurement: 1000, billable: true }
            ],
            prices: [
              {
                meter: 'meter1',
                date: '2023-12-31',
                unit: { amount: 0.25, currency: Currency.EUR },
                base: { amount: 10, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomesSingleBillable
    });

    const powerMeter = mockHomesSingleBillable.home1.electricity.meter1;
    const bills = component.getBills(powerMeter);
    
    expect(bills).toHaveLength(0);
  });

  test('component has initial empty state', () => {
    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomes
    });

    expect(component.state).toEqual({});
  });

  test('getPowerMeters handles measurements with various dates', () => {
    const mockHomesVariousDates: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        electricity: {
          'meter1': {
            measurements: [
              { meter: 'meter1', date: '2024-01-01', measurement: 1000, billable: true },
              { meter: 'meter1', date: '2024-01-15', measurement: 1050, billable: false },
              { meter: 'meter1', date: '2024-02-01', measurement: 1100, billable: true },
              { meter: 'meter1', date: '2024-03-01', measurement: 1200, billable: true }
            ],
            prices: [
              {
                meter: 'meter1',
                date: '2023-12-01',
                unit: { amount: 0.25, currency: Currency.EUR },
                base: { amount: 10, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Electricity({ 
      fetchHomes: jest.fn(),
      fetchElectricity: jest.fn(),
      homes: mockHomesVariousDates
    });

    const powerMeter = mockHomesVariousDates.home1.electricity.meter1;
    const result = component.getPowerMeters(powerMeter);
    
    expect(result).toHaveLength(4);
    expect(result[0].consumption).toBe(0);
    expect(result[1].consumption).toBe(50);
    expect(result[2].consumption).toBe(50);
    expect(result[3].consumption).toBe(100);
  });
});
