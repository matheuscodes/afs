import reducer from '../../src/reducers/long-term';
import { LONG_TERM, LOAD_UPKEEPS, LOAD_SAVINGS } from '../../src/actions/long-term';

describe('long-term reducer', () => {
  test('initial state is empty object', () => {
    expect(reducer(undefined as any, { type: '@@INIT' })).toEqual({});
  });

  test('LOAD_UPKEEPS sets upkeep on LONG_TERM action', () => {
    const upkeeps = [{ id: 'u1' }];
    const next = reducer({}, { type: LONG_TERM, operation: LOAD_UPKEEPS, payload: upkeeps } as any);
    expect(next.upkeep).toEqual(upkeeps);
  });

  test('LOAD_SAVINGS sets savings on LONG_TERM action', () => {
    const savings = [{ id: 's1' }];
    const next = reducer({}, { type: LONG_TERM, operation: LOAD_SAVINGS, payload: savings } as any);
    expect(next.savings).toEqual(savings);
  });

  test('unknown operation returns same state', () => {
    const state = { x: 1 };
    const next = reducer(state, { type: LONG_TERM, operation: 'UNKNOWN', payload: [] } as any);
    expect(next).toBe(state);
  });
});