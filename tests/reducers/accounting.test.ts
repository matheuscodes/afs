import reducer from '../../src/reducers/accounting';
import { ACCOUNTING, LOAD_ACCOUNTS } from '../../src/actions/accounting';

describe('accounting reducer', () => {
  test('initial state is empty object', () => {
    expect(reducer(undefined as any, { type: '@@INIT' })).toEqual({});
  });

  test('LOAD_ACCOUNTS stores accounts by id', () => {
    const payload = [
      { id: 'a1', name: 'A', type: 'Saving' },
      { id: 'a2', name: 'B', type: 'Checking' },
    ];
    const next = reducer({}, { type: ACCOUNTING, operation: LOAD_ACCOUNTS, payload });
    expect(next.accounts).toBeDefined();
    expect(next.accounts.a1).toEqual(payload[0]);
    expect(next.accounts.a2).toEqual(payload[1]);
  });
});