import rootReducer from '../../src/reducers';

describe('root reducer (index)', () => {
  test('initial state contains expected top-level reducer keys', () => {
    const state = rootReducer(undefined as any, { type: '@@INIT' });
    expect(state).toBeDefined();
    // keys combined in src/reducers/index.ts
    expect(state).toHaveProperty('bookkeeping');
    expect(state).toHaveProperty('accounting');
    expect(state).toHaveProperty('cars');
    expect(state).toHaveProperty('homes');
    expect(state).toHaveProperty('properties');
    expect(state).toHaveProperty('longTerm');
  });
});