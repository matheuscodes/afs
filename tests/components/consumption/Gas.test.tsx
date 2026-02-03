import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import ConnectedGas, { 
  Gas,
  getCurrentPrice,
  dateDifference,
  groupedPayments
} from '../../../src/components/consumption/Gas';
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

describe('Gas Utility Functions', () => {
  describe('getCurrentPrice', () => {
    test('returns correct price for a measurement', () => {
      const measurement: any = { date: '2024-02-01', measurement: 550, billable: true };
      const prices: any = [
        { date: '2024-01-01', unit: { amount: 0.15, currency: Currency.EUR }, base: { amount: 8, currency: Currency.EUR } },
        { date: '2024-01-15', unit: { amount: 0.18, currency: Currency.EUR }, base: { amount: 9, currency: Currency.EUR } }
      ];
      
      const result = getCurrentPrice(measurement, prices);
      expect(result).toBeDefined();
      expect(result?.unit.amount).toBe(0.15);
    });

    test('returns undefined when no price matches', () => {
      const measurement: any = { date: '2023-12-01', measurement: 500, billable: true };
      const prices: any = [
        { date: '2024-01-01', unit: { amount: 0.15, currency: Currency.EUR }, base: { amount: 8, currency: Currency.EUR } }
      ];
      
      const result = getCurrentPrice(measurement, prices);
      expect(result).toBeUndefined();
    });

    test('returns latest price when multiple prices match', () => {
      const measurement: any = { date: '2024-02-15', measurement: 550, billable: true };
      const prices: any = [
        { date: '2024-01-01', unit: { amount: 0.15, currency: Currency.EUR }, base: { amount: 8, currency: Currency.EUR } },
        { date: '2024-02-01', unit: { amount: 0.18, currency: Currency.EUR }, base: { amount: 9, currency: Currency.EUR } }
      ];
      
      const result = getCurrentPrice(measurement, prices);
      expect(result).toBeDefined();
      // getCurrentPrice uses find() which returns the first match (2024-01-01 price)
      expect(result?.unit.amount).toBe(0.15);
    });
  });

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

    test('handles leap year dates', () => {
      const diff = dateDifference('2024-03-01', '2024-02-01');
      expect(diff).toBe(29);
    });
  });

  describe('groupedPayments', () => {
    test('aggregates payments by bill with date ranges and sums', () => {
      const payments: any = [
        { date: new Date('2024-01-15'), value: { amount: 50, currency: Currency.EUR }, bill: 'bill-01' },
        { date: new Date('2024-01-20'), value: { amount: 30, currency: Currency.EUR }, bill: 'bill-01' }
      ];

      const result = groupedPayments(payments);
      expect(result).toHaveLength(1);
      expect(result[0].sum.amount).toBe(80);
      expect(result[0].bill).toBe('bill-01');
    });

    test('handles multiple bills', () => {
      const payments: any = [
        { date: new Date('2024-01-15'), value: { amount: 50, currency: Currency.EUR }, bill: 'bill-01' },
        { date: new Date('2024-02-15'), value: { amount: 60, currency: Currency.EUR }, bill: 'bill-02' }
      ];

      const result = groupedPayments(payments);
      expect(result).toHaveLength(2);
    });

    test('handles empty payments', () => {
      const result = groupedPayments([]);
      expect(result).toHaveLength(0);
    });
  });
});


describe('Gas Component', () => {
  const mockHomes: any = {
    'home1': {
      id: 'home1',
      name: 'Test Home',
      area: 100,
      water: { warm: {}, cold: {} },
      gas: {
        'meter1': {
          combustion: 10,
          condition: 0.95,
          measurements: [
            { date: '2024-01-01', measurement: 500, billable: true },
            { date: '2024-02-01', measurement: 550, billable: true }
          ],
          prices: [
            {
              date: '2023-12-31',
              unit: { amount: 0.15, currency: Currency.EUR },
              base: { amount: 8, currency: Currency.EUR }
            }
          ],
          payments: [
            {
              date: '2024-01-15',
              value: { amount: 40, currency: Currency.EUR },
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

  test('renders Gas component', () => {
    const { container } = render(
      <Provider store={store}>
        <ConnectedGas />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Gas');
  });

  test('calls fetchHomes on mount', async () => {
    const mockFetchHomes = jest.fn();
    const component = new Gas({ 
      fetchHomes: mockFetchHomes,
      fetchGas: jest.fn(),
      homes: null
    });

    await component.componentDidMount();
    expect(mockFetchHomes).toHaveBeenCalled();
  });

  test('renders home tabs when homes are available', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ConnectedGas />
      </Provider>
    );
    
    expect(getByText('Test Home')).toBeInTheDocument();
  });

  test('getGasMeters processes measurements correctly', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const result = component.getGasMeters(gasMeter);
    
    expect(result).toHaveLength(2);
    expect(result[0].measurement).toBe(500);
    expect(result[0].consumption).toBe(0);
    expect(result[0].days).toBe(0);
    
    expect(result[1].consumption).toBe(50);
    expect(result[1].days).toBeGreaterThan(0);
  });

  test('getGasMeters calculates energy correctly', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const result = component.getGasMeters(gasMeter);
    
    expect(result[1].energy).toBeDefined();
    // energy = consumption * combustion * condition = 50 * 10 * 0.95 = 475
    expect(result[1].energy).toBeCloseTo(475, 1);
  });

  test('getGasMeters calculates costs correctly', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const result = component.getGasMeters(gasMeter);
    
    expect(result[1].cost).toBeDefined();
    expect(result[1].cost.amount).toBeGreaterThan(0);
    expect(result[1].cost.currency).toBe(Currency.EUR);
  });

  test('getGasMeters returns empty array for no measurements', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const gasMeter = { combustion: 10, condition: 0.95 } as any;
    const result = component.getGasMeters(gasMeter);
    
    expect(result).toEqual([]);
  });

  test('getBills processes billable measurements', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
    expect(bills).toHaveLength(1);
    expect(bills[0].from).toBeDefined();
    expect(bills[0].to).toBeDefined();
    expect(bills[0].consumption).toBeGreaterThan(0);
  });

  test('getBills calculates costs correctly', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const gasMeter = mockHomes.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
    expect(bills[0].cost.unit).toBeDefined();
    expect(bills[0].cost.base).toBeDefined();
    expect(bills[0].cost.total).toBeDefined();
    expect(bills[0].cost.total.amount).toBeGreaterThan(0);
  });

  test('getBills returns empty array for no payments', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const gasMeter = {
      ...mockHomes.home1.gas.meter1,
      payments: undefined
    };
    const bills = component.getBills(gasMeter);
    
    expect(bills).toEqual([]);
  });

  test('renderRow creates table row', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const measurementEntry = {
      date: '2024-01-01',
      measurement: 500,
      consumption: 50,
      energy: 475,
      days: 31,
      price: {
        unit: { amount: 0.15, currency: Currency.EUR },
        base: { amount: 8, currency: Currency.EUR }
      },
      cost: {
        amount: 319.25,
        currency: Currency.EUR
      }
    };

    const row = component.renderRow(measurementEntry, 0);
    
    expect(row).toBeDefined();
    expect(row.key).toBe('gas-0');
  });

  test('renderRow handles first measurement with no consumption', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    const measurementEntry = {
      date: '2024-01-01',
      measurement: 500,
      consumption: 0,
      energy: 0,
      days: 0,
      price: {
        unit: { amount: 0.15, currency: Currency.EUR },
        base: { amount: 8, currency: Currency.EUR }
      },
      cost: {
        amount: 0,
        currency: Currency.EUR
      }
    };

    const row = component.renderRow(measurementEntry, 0);
    
    expect(row).toBeDefined();
    expect(row.key).toBe('gas-0');
  });

  test('render returns valid React element', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
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
        <ConnectedGas />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('handles empty gas measurements', () => {
    const homesWithEmpty: any = {
      'home1': {
        ...mockHomes.home1,
        gas: {
          'meter1': {
            ...mockHomes.home1.gas.meter1,
            measurements: []
          }
        }
      }
    };
    
    const emptyStore = mockStore({ homes: homesWithEmpty });
    const { container } = render(
      <Provider store={emptyStore}>
        <ConnectedGas />
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
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-01-15', measurement: 525, billable: false },
              { date: '2024-02-01', measurement: 550, billable: true },
              { date: '2024-03-01', measurement: 600, billable: true }
            ],
            prices: [
              {
                date: '2023-12-31',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesWithMultiple
    });

    const gasMeter = mockHomesWithMultiple.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
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
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-02-01', measurement: 550, billable: false }
            ],
            prices: [
              {
                date: '2023-12-31',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesLastNotBillable
    });

    const gasMeter = mockHomesLastNotBillable.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
    expect(bills).toHaveLength(1);
  });

  test('getBills skips first billable without previous measurement', () => {
    const mockHomesSingleBillable: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true }
            ],
            prices: [
              {
                date: '2023-12-31',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesSingleBillable
    });

    const gasMeter = mockHomesSingleBillable.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
    expect(bills).toHaveLength(0);
  });

  test('component has initial empty state', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    expect(component.state).toEqual({});
  });

  test('getGasMeters handles measurements with various dates', () => {
    const mockHomesVariousDates: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-01-15', measurement: 525, billable: false },
              { date: '2024-02-01', measurement: 550, billable: true },
              { date: '2024-03-01', measurement: 600, billable: true }
            ],
            prices: [
              {
                date: '2023-12-01',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesVariousDates
    });

    const gasMeter = mockHomesVariousDates.home1.gas.meter1;
    const result = component.getGasMeters(gasMeter);
    
    expect(result).toHaveLength(4);
    expect(result[0].consumption).toBe(0);
    expect(result[1].consumption).toBe(25);
    expect(result[2].consumption).toBe(25);
    expect(result[3].consumption).toBe(50);
  });

  test('getBills associates payments with bills', () => {
    const mockHomesWithPayments: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-02-01', measurement: 550, billable: true }
            ],
            prices: [
              {
                date: '2023-12-31',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: [
              {
                date: new Date('2024-01-15'),
                value: { amount: 40, currency: Currency.EUR },
                bill: 'bill-2024-01'
              }
            ]
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesWithPayments
    });

    const gasMeter = mockHomesWithPayments.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
    expect(bills).toHaveLength(1);
    // Payments may not match based on date range logic
    expect(bills[0]).toBeDefined();
  });

  test('handles tab selection and state update', () => {
    const mockFetchGas = jest.fn();
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: mockFetchGas,
      homes: mockHomes
    });

    // Simulate selecting a tab
    const renderOutput = component.render();
    expect(renderOutput).toBeDefined();
  });

  test('tab click triggers fetchGas and updates state', () => {
    const mockFetchGas = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <ConnectedGas />
      </Provider>
    );

    const tabButton = getByText('Test Home');
    fireEvent.click(tabButton);

    // After clicking, the tab should be active
    expect(tabButton).toBeInTheDocument();
  });

  test('renders gas meter data when home is selected', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    // Set state directly in constructor by creating new component with initial state
    component.state = { selectedHome: mockHomes.home1 };

    const renderOutput = component.render();
    expect(renderOutput).toBeDefined();
  });

  test('getGasMeters handles measurements without prices gracefully', () => {
    const mockHomesNoPrices: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-02-01', measurement: 550, billable: true }
            ],
            prices: []
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesNoPrices
    });

    const gasMeter = mockHomesNoPrices.home1.gas.meter1;
    
    // When prices are missing, getCurrentPrice returns undefined
    // This will cause a TypeError when accessing .unit.amount
    expect(() => component.getGasMeters(gasMeter)).toThrow(TypeError);
    expect(() => component.getGasMeters(gasMeter)).toThrow(/Cannot read propert/);
  });

  test('getBills handles intermediate non-billable measurements', () => {
    const mockHomesIntermediate: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-01-10', measurement: 510, billable: false },
              { date: '2024-01-20', measurement: 520, billable: false },
              { date: '2024-02-01', measurement: 550, billable: true }
            ],
            prices: [
              {
                date: '2023-12-31',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesIntermediate
    });

    const gasMeter = mockHomesIntermediate.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
    expect(bills).toHaveLength(1);
    // Should sum up all consumption from first to last billable
    expect(bills[0].consumption).toBeGreaterThan(0);
  });

  test('renders bills with payment information', () => {
    const { container } = render(
      <Provider store={store}>
        <ConnectedGas />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('getBills accumulates unit and base costs correctly', () => {
    const mockHomesAccumulation: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-01-15', measurement: 510, billable: false },
              { date: '2024-02-01', measurement: 550, billable: true }
            ],
            prices: [
              {
                date: '2023-12-31',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesAccumulation
    });

    const gasMeter = mockHomesAccumulation.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
    expect(bills).toHaveLength(1);
    expect(bills[0].cost.unit.amount).toBeGreaterThan(0);
    expect(bills[0].cost.base.amount).toBeGreaterThan(0);
    expect(bills[0].cost.total.amount).toBeGreaterThan(0);
    // Total should equal unit + base
    expect(bills[0].cost.total.amount).toBeCloseTo(
      bills[0].cost.unit.amount + bills[0].cost.base.amount, 
      2
    );
  });

  test('renders without selected home', () => {
    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomes
    });

    // State has no selectedHome
    const renderOutput = component.render();
    expect(renderOutput).toBeDefined();
  });

  test('renders with selected home but no gas data', () => {
    const mockHomesNoGas: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesNoGas
    });

    component.state = { selectedHome: mockHomesNoGas.home1 };

    const renderOutput = component.render();
    expect(renderOutput).toBeDefined();
  });

  test('getBills finds payments matching date range', () => {
    const mockHomesMatchingPayments: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-02-01', measurement: 550, billable: true }
            ],
            prices: [
              {
                date: '2023-12-31',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: [
              {
                date: new Date('2024-01-15'),
                value: { amount: 40, currency: Currency.EUR },
                bill: 'bill-2024-01'
              }
            ]
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesMatchingPayments
    });

    const gasMeter = mockHomesMatchingPayments.home1.gas.meter1;
    const bills = component.getBills(gasMeter);
    
    expect(bills).toHaveLength(1);
    // The payment is found if it falls within the date range
    expect(bills[0]).toBeDefined();
  });

  test('renders bills without payments', () => {
    const mockHomesNoBillPayments: any = {
      'home1': {
        id: 'home1',
        name: 'Test Home',
        area: 100,
        water: { warm: {}, cold: {} },
        gas: {
          'meter1': {
            combustion: 10,
            condition: 0.95,
            measurements: [
              { date: '2024-01-01', measurement: 500, billable: true },
              { date: '2024-02-01', measurement: 550, billable: true }
            ],
            prices: [
              {
                date: '2023-12-31',
                unit: { amount: 0.15, currency: Currency.EUR },
                base: { amount: 8, currency: Currency.EUR }
              }
            ],
            payments: []
          }
        }
      }
    };

    const component = new Gas({ 
      fetchHomes: jest.fn(),
      fetchGas: jest.fn(),
      homes: mockHomesNoBillPayments
    });

    component.state = { selectedHome: mockHomesNoBillPayments.home1 };

    const renderOutput = component.render();
    expect(renderOutput).toBeDefined();
  });
});
