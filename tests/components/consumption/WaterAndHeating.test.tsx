import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import WaterAndHeating, { UnconnectedWaterAndHeating } from '../../../src/components/consumption/WaterAndHeating';
import { Currency } from '../../../src/models/Activity';

// Mock the child components
jest.mock('../../../src/components/consumption/WaterTable', () => {
  return function WaterTable(props: any) {
    return <div data-testid="water-table">WaterTable</div>;
  };
});

jest.mock('../../../src/components/consumption/HeatingTable', () => {
  return function HeatingTable(props: any) {
    return <div data-testid="heating-table">HeatingTable</div>;
  };
});

jest.mock('../../../src/components/consumption/WaterAndHeatingBill', () => {
  return function WaterAndHeatingBill(props: any) {
    return <div data-testid="bill-overview">Bill {props.year}</div>;
  };
});

// Mock the HomeService to prevent actual API calls
const mockFetchHomes = jest.fn(() => (dispatch: any) => Promise.resolve());
const mockFetchWater = jest.fn((homeId: string) => (dispatch: any) => Promise.resolve());
const mockFetchHeating = jest.fn((homeId: string) => (dispatch: any) => Promise.resolve());

jest.mock('../../../src/services/HomeService', () => ({
  fetchHomes: () => mockFetchHomes(),
  fetchWater: (homeId: string) => mockFetchWater(homeId),
  fetchHeating: (homeId: string) => mockFetchHeating(homeId),
  updateHomes: jest.fn()
}));

const mockStore = configureStore([thunk]);

describe('WaterAndHeating', () => {
  const mockHomes = {
    'home1': {
      id: 'home1',
      name: 'Test Home',
      area: 100,
      water: {
        warm: {
          id: 'warm1',
          measurements: [
            { date: '2024-01-01', measurement: 50, billable: false },
            { date: '2024-06-01', measurement: 53, billable: true },
            { date: '2024-12-01', measurement: 56, billable: true }
          ],
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 0.5, currency: Currency.EUR },
              base: { amount: 5, currency: Currency.EUR }
            }
          ],
          payments: [] as any[]
        },
        cold: {
          id: 'cold1',
          measurements: [
            { date: '2024-01-01', measurement: 100, billable: false },
            { date: '2024-06-01', measurement: 105, billable: true },
            { date: '2024-12-01', measurement: 110, billable: true }
          ],
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 0.3, currency: Currency.EUR },
              base: { amount: 3, currency: Currency.EUR }
            }
          ],
          payments: [] as any[]
        }
      },
      heaters: {
        'heater1': {
          id: 'heater1',
          location: 'Living Room',
          factor: 1.0,
          area: 50,
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 1.0, currency: Currency.EUR },
              base: { amount: 10, currency: Currency.EUR }
            }
          ],
          measurements: [
            { date: '2024-01-01', measurement: 100, billable: false },
            { date: '2024-06-01', measurement: 150, billable: true },
            { date: '2024-12-01', measurement: 200, billable: true }
          ],
          payments: [] as any[]
        }
      }
    },
    'home2': {
      id: 'home2',
      name: 'Second Home',
      area: 80,
      water: {
        warm: null as any,
        cold: {
          id: 'cold2',
          measurements: [] as any[],
          prices: [] as any[],
          payments: [] as any[]
        }
      },
      heaters: {}
    }
  };

  const initialState = {
    homes: mockHomes
  };

  let store: any;
  let component: any;

  beforeEach(() => {
    store = mockStore(initialState);
    const originalDispatch = store.dispatch.bind(store);
    store.dispatch = jest.fn((action: any) => {
      try {
        if (typeof action === 'function') {
          return Promise.resolve();
        }
        return originalDispatch(action);
      } catch (e) {
        return Promise.resolve();
      }
    });
    
    mockFetchHomes.mockClear();
    mockFetchWater.mockClear();
    mockFetchHeating.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders WaterAndHeating component with title', () => {
      const { container } = render(
        <Provider store={store}>
          <WaterAndHeating />
        </Provider>
      );
      expect(screen.getByText('Water and Heating Costs')).toBeInTheDocument();
    });

    test('renders tabs for each home', () => {
      render(
        <Provider store={store}>
          <WaterAndHeating />
        </Provider>
      );
      expect(screen.getByText('Test Home')).toBeInTheDocument();
      expect(screen.getByText('Second Home')).toBeInTheDocument();
    });

    test('renders nothing when homes is undefined', () => {
      const emptyStore = mockStore({ homes: undefined });
      const { container } = render(
        <Provider store={emptyStore}>
          <WaterAndHeating />
        </Provider>
      );
      expect(screen.getByText('Water and Heating Costs')).toBeInTheDocument();
    });

    test('calls fetchHomes on mount', async () => {
      render(
        <Provider store={store}>
          <WaterAndHeating />
        </Provider>
      );
      await waitFor(() => {
        expect(mockFetchHomes).toHaveBeenCalled();
      });
    });

    test('renders tables and bills when home is selected', () => {
      render(
        <Provider store={store}>
          <WaterAndHeating />
        </Provider>
      );
      
      const homeTab = screen.getByText('Test Home');
      fireEvent.click(homeTab);
      
      expect(screen.getByTestId('water-table')).toBeInTheDocument();
      expect(screen.getByTestId('heating-table')).toBeInTheDocument();
    });

    test('calls fetchWater and fetchHeating when tab is selected', () => {
      render(
        <Provider store={store}>
          <WaterAndHeating />
        </Provider>
      );
      
      const homeTab = screen.getByText('Test Home');
      fireEvent.click(homeTab);
      
      expect(mockFetchWater).toHaveBeenCalledWith('home1');
      expect(mockFetchHeating).toHaveBeenCalledWith('home1');
    });
  });

  describe('getWaterReadings', () => {
    let instance: any;

    beforeEach(() => {
      instance = new UnconnectedWaterAndHeating({ homes: mockHomes });
    });

    test('returns empty array when measurements is undefined', () => {
      const waterMeter: any = { measurements: undefined };
      
      const result = instance.getWaterReadings(waterMeter, 100);
      expect(result).toEqual([]);
    });

    test('processes water readings correctly', () => {
      const waterMeter = {
        measurements: [
          { date: '2024-01-01', measurement: 100, billable: true },
          { date: '2024-02-01', measurement: 105, billable: true }
        ],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 0.5, currency: Currency.EUR },
            base: { amount: 2, currency: Currency.EUR }
          }
        ]
      };
      
      const result = instance.getWaterReadings(waterMeter, 50);
      
      expect(result).toHaveLength(2);
      expect(result[0].consumption).toBe(0);
      expect(result[1].consumption).toBe(5);
      expect(result[1].cost.amount).toBe(5 * 0.5 + 50 * 2);
    });

    test('handles single measurement', () => {
      const waterMeter = {
        measurements: [
          { date: '2024-01-01', measurement: 100, billable: false }
        ],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 0.5, currency: Currency.EUR },
            base: { amount: 2, currency: Currency.EUR }
          }
        ]
      };
      
      const result = instance.getWaterReadings(waterMeter, 50);
      
      expect(result).toHaveLength(1);
      expect(result[0].consumption).toBe(0);
      expect(result[0].days).toBe(0);
    });

    test('calculates days between measurements', () => {
      const waterMeter = {
        measurements: [
          { date: '2024-01-01T00:00:00Z', measurement: 100, billable: true },
          { date: '2024-01-31T00:00:00Z', measurement: 105, billable: true }
        ],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 0.5, currency: Currency.EUR },
            base: { amount: 2, currency: Currency.EUR }
          }
        ]
      };
      
      const result = instance.getWaterReadings(waterMeter, 50);
      
      expect(result[1].days).toBeGreaterThan(0);
    });
  });

  describe('getHeaterReadings', () => {
    let instance: any;

    beforeEach(() => {
      instance = new UnconnectedWaterAndHeating({ homes: mockHomes });
    });

    test('returns empty array when measurements is undefined', () => {
      const heater: any = { measurements: undefined };
      
      const result = instance.getHeaterReadings(heater, 100);
      expect(result).toEqual([]);
    });

    test('processes heater readings correctly', () => {
      const heater = {
        measurements: [
          { date: '2024-01-01', measurement: 100, billable: true },
          { date: '2024-02-01', measurement: 150, billable: true }
        ],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 1.0, currency: Currency.EUR },
            base: { amount: 5, currency: Currency.EUR }
          }
        ]
      };
      
      const result = instance.getHeaterReadings(heater, 50);
      
      expect(result).toHaveLength(2);
      expect(result[0].consumption).toBe(100);
      expect(result[1].consumption).toBe(50);
      expect(result[1].cost.amount).toBe(50 * 1.0 + 50 * 5);
    });

    test('initializes lastMeasurement to 0', () => {
      const heater = {
        measurements: [
          { date: '2024-01-01', measurement: 100, billable: true }
        ],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 1.0, currency: Currency.EUR },
            base: { amount: 5, currency: Currency.EUR }
          }
        ]
      };
      
      const result = instance.getHeaterReadings(heater, 50);
      
      expect(result[0].consumption).toBe(100);
    });
  });

  describe('getAllBills', () => {
    let instance: any;

    beforeEach(() => {
      instance = new UnconnectedWaterAndHeating({ homes: mockHomes });
    });

    test('gets all bills correctly', () => {
      const data = {
        water: {
          cold: mockHomes.home1.water.cold,
          warm: mockHomes.home1.water.warm
        },
        heaters: mockHomes.home1.heaters,
        area: 100
      };
      
      const result = instance.getAllBills(data);
      
      expect(result).toHaveProperty('cold');
      expect(result).toHaveProperty('warm');
      expect(result).toHaveProperty('heating');
    });
  });

  describe('getHeatingBills', () => {
    let instance: any;

    beforeEach(() => {
      instance = new UnconnectedWaterAndHeating({ homes: mockHomes });
    });

    test('returns empty heaters object when no heaters', () => {
      const result = instance.getHeatingBills({}, 100);
      
      expect(result).toEqual({ heaters: {} });
    });

    test('processes heating bills for multiple heaters', () => {
      const heaters = {
        heater1: {
          id: 'heater1',
          measurements: [
            { date: '2024-01-01', measurement: 100, billable: true },
            { date: '2024-06-01', measurement: 150, billable: true }
          ],
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 1.0, currency: Currency.EUR },
              base: { amount: 5, currency: Currency.EUR }
            }
          ],
          payments: [] as any[]
        },
        heater2: {
          id: 'heater2',
          measurements: [
            { date: '2024-01-01', measurement: 50, billable: true }
          ],
          prices: [
            {
              date: '2024-01-01',
              unit: { amount: 1.0, currency: Currency.EUR },
              base: { amount: 5, currency: Currency.EUR }
            }
          ],
          payments: [] as any[]
        }
      };
      
      const result = instance.getHeatingBills(heaters, 100);
      
      expect(result.heaters).toHaveProperty('heater1');
      expect(result.heaters).toHaveProperty('heater2');
    });
  });

  describe('getWaterBills', () => {
    let instance: any;

    beforeEach(() => {
      instance = new UnconnectedWaterAndHeating({ homes: mockHomes });
    });

    test('returns empty object when waterMeter is null', () => {
      const result = instance.getWaterBills(null, 100);
      
      expect(result).toEqual({});
    });

    test('returns empty object when waterMeter is undefined', () => {
      const result = instance.getWaterBills(undefined, 100);
      
      expect(result).toEqual({});
    });

    test('processes water bills correctly', () => {
      const waterMeter = {
        measurements: [
          { date: '2024-01-01', measurement: 100, billable: true },
          { date: '2024-06-01', measurement: 105, billable: true }
        ],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 0.5, currency: Currency.EUR },
            base: { amount: 2, currency: Currency.EUR }
          }
        ],
        payments: [] as any[]
      };
      
      const result = instance.getWaterBills(waterMeter, 50);
      
      expect(result).toHaveProperty('readings');
      expect(result).toHaveProperty('bills');
    });
  });

  describe('getBills', () => {
    let instance: any;

    beforeEach(() => {
      instance = new UnconnectedWaterAndHeating({ homes: mockHomes });
    });

    test('returns only readings when payments is undefined', () => {
      const meter: any = { payments: undefined };
      const readings = [
        { date: '2024-01-01', measurement: 100 }
      ];
      
      const result = instance.getBills(meter, 100, readings);
      
      expect(result).toEqual({ readings });
    });

    test('processes bills for single year', () => {
      const meter = {
        area: 50,
        payments: [] as any[],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 0.5, currency: Currency.EUR },
            base: { amount: 2, currency: Currency.EUR }
          }
        ]
      };
      const readings = [
        { date: '2024-01-01', measurement: 100, billable: true },
        { date: '2024-06-01', measurement: 105, billable: true }
      ];
      
      const result = instance.getBills(meter, 100, readings);
      
      expect(result.bills).toHaveProperty('2024');
      expect(result.bills['2024']).toHaveProperty('from');
      expect(result.bills['2024']).toHaveProperty('to');
      expect(result.bills['2024']).toHaveProperty('consumption');
      expect(result.bills['2024'].consumption).toBe(5);
    });

    test('processes bills for multiple years', () => {
      const meter = {
        area: 50,
        payments: [] as any[],
        prices: [
          {
            date: '2023-01-01',
            unit: { amount: 0.5, currency: Currency.EUR },
            base: { amount: 2, currency: Currency.EUR }
          }
        ]
      };
      const readings = [
        { date: '2023-01-01', measurement: 100, billable: true },
        { date: '2023-12-01', measurement: 110, billable: true },
        { date: '2024-06-01', measurement: 115, billable: true },
        { date: '2024-12-01', measurement: 120, billable: true }
      ];
      
      const result = instance.getBills(meter, 100, readings);
      
      expect(result.bills).toHaveProperty('2023');
      expect(result.bills).toHaveProperty('2024');
    });

    test('handles bill when only currentReading exists (no previousReading)', () => {
      const meter = {
        area: 50,
        payments: [] as any[],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 0.5, currency: Currency.EUR },
            base: { amount: 2, currency: Currency.EUR }
          }
        ]
      };
      const readings = [
        { date: '2024-06-01', measurement: 105, billable: true }
      ];
      
      const result = instance.getBills(meter, 100, readings);
      
      expect(result.bills).toHaveProperty('2024');
      expect(result.bills['2024']).not.toHaveProperty('from');
      expect(result.bills['2024']).toHaveProperty('to');
      expect(result.bills['2024'].consumption).toBe(105);
      expect(result.bills['2024'].days).toBe(0);
    });

    test('filters readings by billable and last item', () => {
      const meter = {
        area: 50,
        payments: [] as any[],
        prices: [
          {
            date: '2024-01-01',
            unit: { amount: 0.5, currency: Currency.EUR },
            base: { amount: 2, currency: Currency.EUR }
          }
        ]
      };
      const readings = [
        { date: '2024-01-01', measurement: 100, billable: false },
        { date: '2024-03-01', measurement: 103, billable: false },
        { date: '2024-06-01', measurement: 105, billable: true },
        { date: '2024-12-01', measurement: 110, billable: false }
      ];
      
      const result = instance.getBills(meter, 100, readings);
      
      expect(result.bills).toHaveProperty('2024');
      expect(result.bills['2024'].consumption).toBe(5);
    });

    test('handles empty readings array', () => {
      const meter = {
        area: 50,
        payments: [] as any[]
      };
      const readings: any[] = [];
      
      const result = instance.getBills(meter, 100, readings);
      
      expect(result.bills).toEqual({});
    });
  });

  describe('getOverviews', () => {
    let instance: any;

    beforeEach(() => {
      instance = new UnconnectedWaterAndHeating({ homes: mockHomes });
    });

    test('creates yearly overviews from bills', () => {
      const allBills = {
        cold: {
          bills: {
            '2024': {
              cost: {
                unit: { amount: 10, currency: Currency.EUR },
                base: { amount: 5, currency: Currency.EUR },
                total: { amount: 15, currency: Currency.EUR }
              }
            }
          }
        },
        warm: {
          bills: {
            '2024': {
              cost: {
                unit: { amount: 20, currency: Currency.EUR },
                base: { amount: 10, currency: Currency.EUR },
                total: { amount: 30, currency: Currency.EUR }
              }
            }
          }
        },
        heating: {
          heaters: {
            heater1: {
              id: 'heater1',
              location: 'Living Room',
              bills: {
                '2024': {
                  cost: {
                    unit: { amount: 50, currency: Currency.EUR },
                    base: { amount: 25, currency: Currency.EUR },
                    total: { amount: 75, currency: Currency.EUR }
                  }
                }
              }
            }
          }
        }
      };
      
      const result = instance.getOverviews(allBills);
      
      expect(result).toHaveProperty('2024');
      expect(result['2024'].cost.total.amount).toBe(120);
      expect(result['2024']).toHaveProperty('cold');
      expect(result['2024']).toHaveProperty('warm');
      expect(result['2024']).toHaveProperty('heaters');
    });

    test('handles bills with only cold water', () => {
      const allBills = {
        cold: {
          bills: {
            '2024': {
              cost: {
                unit: { amount: 10, currency: Currency.EUR },
                base: { amount: 5, currency: Currency.EUR },
                total: { amount: 15, currency: Currency.EUR }
              }
            }
          }
        }
      };
      
      const result = instance.getOverviews(allBills);
      
      expect(result).toHaveProperty('2024');
      expect(result['2024'].cost.total.amount).toBe(15);
    });

    test('handles bills with only warm water', () => {
      const allBills = {
        warm: {
          bills: {
            '2024': {
              cost: {
                unit: { amount: 20, currency: Currency.EUR },
                base: { amount: 10, currency: Currency.EUR },
                total: { amount: 30, currency: Currency.EUR }
              }
            }
          }
        }
      };
      
      const result = instance.getOverviews(allBills);
      
      expect(result).toHaveProperty('2024');
      expect(result['2024'].cost.total.amount).toBe(30);
    });

    test('handles bills with only heating', () => {
      const allBills = {
        heating: {
          heaters: {
            heater1: {
              id: 'heater1',
              location: 'Living Room',
              bills: {
                '2024': {
                  cost: {
                    unit: { amount: 50, currency: Currency.EUR },
                    base: { amount: 25, currency: Currency.EUR },
                    total: { amount: 75, currency: Currency.EUR }
                  }
                }
              }
            }
          }
        }
      };
      
      const result = instance.getOverviews(allBills);
      
      expect(result).toHaveProperty('2024');
      expect(result['2024'].cost.total.amount).toBe(75);
      expect(result['2024'].heaters).toHaveLength(1);
      expect(result['2024'].heaters[0].id).toBe('heater1');
    });

    test('handles multiple heaters in overview', () => {
      const allBills = {
        heating: {
          heaters: {
            heater1: {
              id: 'heater1',
              location: 'Living Room',
              bills: {
                '2024': {
                  cost: {
                    unit: { amount: 50, currency: Currency.EUR },
                    base: { amount: 25, currency: Currency.EUR },
                    total: { amount: 75, currency: Currency.EUR }
                  }
                }
              }
            },
            heater2: {
              id: 'heater2',
              location: 'Bedroom',
              bills: {
                '2024': {
                  cost: {
                    unit: { amount: 30, currency: Currency.EUR },
                    base: { amount: 15, currency: Currency.EUR },
                    total: { amount: 45, currency: Currency.EUR }
                  }
                }
              }
            }
          }
        }
      };
      
      const result = instance.getOverviews(allBills);
      
      expect(result['2024'].heaters).toHaveLength(2);
      expect(result['2024'].cost.total.amount).toBe(120);
    });

    test('handles multiple years in overview', () => {
      const allBills = {
        cold: {
          bills: {
            '2023': {
              cost: {
                unit: { amount: 8, currency: Currency.EUR },
                base: { amount: 4, currency: Currency.EUR },
                total: { amount: 12, currency: Currency.EUR }
              }
            },
            '2024': {
              cost: {
                unit: { amount: 10, currency: Currency.EUR },
                base: { amount: 5, currency: Currency.EUR },
                total: { amount: 15, currency: Currency.EUR }
              }
            }
          }
        }
      };
      
      const result = instance.getOverviews(allBills);
      
      expect(result).toHaveProperty('2023');
      expect(result).toHaveProperty('2024');
      expect(result['2023'].cost.total.amount).toBe(12);
      expect(result['2024'].cost.total.amount).toBe(15);
    });

    test('handles empty bills object', () => {
      const allBills = {};
      
      const result = instance.getOverviews(allBills);
      
      expect(result).toEqual({});
    });

    test('handles heaters without bills', () => {
      const allBills = {
        heating: {
          heaters: {
            heater1: {
              id: 'heater1',
              location: 'Living Room'
            }
          }
        }
      };
      
      const result = instance.getOverviews(allBills);
      
      expect(result).toEqual({});
    });
  });
});
