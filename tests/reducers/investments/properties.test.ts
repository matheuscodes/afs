import reducer from '../../../src/reducers/investments/properties';
import { INVESTMENT_PROPERTY, UPDATE_PROPERTIES, UPDATE_PROPERTY } from '../../../src/actions/investments/property';

describe('investments/properties reducer', () => {
  const origLog = console.log;
  beforeEach(() => { jest.clearAllMocks(); console.log = jest.fn(); });
  afterEach(() => { console.log = origLog; });

  test('UPDATE_PROPERTIES stores properties with valuations array', () => {
    const payload = [{ id: 'p1', name: 'Prop' }];
    const next = reducer({}, { type: INVESTMENT_PROPERTY, operation: UPDATE_PROPERTIES, payload } as any);
    expect(next.p1).toBeDefined();
    expect(Array.isArray(next.p1.valuations)).toBe(true);
    expect(next.p1.valuations.length).toBe(0);
  });

  test('UPDATE_PROPERTY replaces valuations for a property', () => {
    const initial: any = { p1: { valuations: [] } };
    const valuations = [{ v: 100 }];
    const next = reducer(initial, { type: INVESTMENT_PROPERTY, operation: UPDATE_PROPERTY, payload: { propertyId: 'p1', valuations } } as any);
    expect(Array.isArray(next.p1.valuations)).toBe(true);
    expect(next.p1.valuations).toEqual(valuations);
  });
});