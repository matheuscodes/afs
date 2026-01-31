import reducer from '../../src/reducers/bookkeeping';
import { BOOKKEEPING, ADD_ACTIVITY, LOAD_ACTIVITIES } from '../../src/actions/bookkeeping';

describe('bookkeeping reducer', () => {
  test('returns initial state (empty array) for unknown action', () => {
    expect(reducer(undefined as any, { type: '@@INIT' })).toEqual([]);
  });

  test('ADD_ACTIVITY appends payload', () => {
    const initial: any[] = [];
    const activity = { id: 'a1', value: 10 };
    const next = reducer(initial, { type: BOOKKEEPING, operation: ADD_ACTIVITY, payload: activity });
    expect(next).toEqual([activity]);
  });

  test('LOAD_ACTIVITIES replaces state', () => {
    const activities = [{ id: 'x' }, { id: 'y' }];
    const next = reducer([], { type: BOOKKEEPING, operation: LOAD_ACTIVITIES, payload: activities });
    expect(next).toBe(activities);
  });
});