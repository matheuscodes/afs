import { Fuel, FuelUnit } from '../../src/models/Car';
import { getCurrentPrice, dateDifference, groupedPayments } from '../../src/models/Bills';
import { parseActivity, parseActivities, Currency } from '../../src/models/Activity';
import { parseAccount, parseAccounts, AccountType } from '../../src/models/Account';
import { MeterMeasurement, MeterPrice, MeterPayment } from '../../src/models/Home';

describe('models - unit tests', () => {
  describe('Car model', () => {
    test('Fuel enum and FuelUnit map are correct', () => {
      expect(Fuel.DIESEL).toBe('Diesel');
      expect(Fuel.GASOLINE).toBe('Gasoline');
      expect(FuelUnit[Fuel.DIESEL]).toBe('l');
      expect(FuelUnit[Fuel.GASOLINE]).toBe('l');
    });
  });

  describe('Activity model', () => {
    test('parseActivity converts date and amount types', () => {
      const raw = JSON.stringify({
        date: '2020-01-02T03:04:05.000Z',
        source: 'src',
        description: 'desc',
        value: { amount: '123.45', currency: Currency.EUR },
        account: 'acc1',
        transfer: false,
        category: 'cat',
      });

      const parsed = parseActivity(raw as any);
      expect(parsed.date instanceof Date).toBeTruthy();
      expect(parsed.date.toISOString()).toBe('2020-01-02T03:04:05.000Z');
      expect(typeof parsed.value.amount).toBe('number');
      expect(parsed.value.amount).toBeCloseTo(123.45);
      expect(parsed.source).toBe('src');
    });

    test('parseActivities splits lines, filters empty and sorts desc by date', () => {
      const a1 = {
        date: '2020-01-01T00:00:00.000Z',
        source: 's1',
        description: 'd1',
        value: { amount: 1, currency: Currency.EUR },
        account: 'acc1',
        transfer: false,
        category: 'c1',
      };
      const a2 = {
        date: '2020-02-01T00:00:00.000Z',
        source: 's2',
        description: 'd2',
        value: { amount: 2, currency: Currency.EUR },
        account: 'acc2',
        transfer: false,
        category: 'c2',
      };

      const input = `${JSON.stringify(a1)}\n\n${JSON.stringify(a2)}\n`;
      const parsed = parseActivities(input as any);
      expect(Array.isArray(parsed)).toBe(true);
      // sorted desc: a2 first
      expect(parsed.length).toBe(2);
      expect(parsed[0].description).toBe('d2');
      expect(parsed[1].description).toBe('d1');
    });

    test('parseActivities returns empty array when undefined', () => {
      expect(parseActivities(undefined as any)).toEqual([]);
    });
  });

  describe('Account model', () => {
    test('parseAccount parses a single account JSON', () => {
      const raw = JSON.stringify({ id: 'acc-1', name: 'MyAcc', type: AccountType.SAVING });
      const parsed = parseAccount(raw as any);
      expect(parsed.id).toBe('acc-1');
      expect(parsed.name).toBe('MyAcc');
      expect(parsed.type).toBe(AccountType.SAVING);
    });

    test('parseAccounts splits newline-delimited accounts and filters empties', () => {
      const a1 = { id: 'a1', name: 'A1', type: AccountType.CHECKING };
      const a2 = { id: 'a2', name: 'A2', type: AccountType.SAVING };
      const input = `${JSON.stringify(a1)}\n\n${JSON.stringify(a2)}\n`;
      const parsed = parseAccounts(input as any);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
      expect(parsed[0].id).toBe('a1');
      expect(parsed[1].id).toBe('a2');
    });

    test('parseAccounts returns empty array for undefined input', () => {
      expect(parseAccounts(undefined as any)).toEqual([]);
    });
  });

  describe('Bills model', () => {
    test('getCurrentPrice finds the latest price <= measurement.date', () => {
      const measurement: MeterMeasurement = {
        meter: 'm1',
        date: new Date('2020-06-15T00:00:00.000Z'),
        measurement: 10,
      };

      const prices: MeterPrice[] = [
        { meter: 'm1', date: new Date('2020-01-01T00:00:00.000Z'), unit: { amount: 1, currency: Currency.EUR }, base: { amount: 1, currency: Currency.EUR } },
        { meter: 'm1', date: new Date('2020-07-01T00:00:00.000Z'), unit: { amount: 2, currency: Currency.EUR }, base: { amount: 2, currency: Currency.EUR } },
      ];

      // The only price <= measurement.date is the 2020-01-01 entry
      const p = getCurrentPrice(measurement, prices);
      expect(p).toBeDefined();
      expect(p!.date.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    });

    test('dateDifference returns days between dates', () => {
      const a = new Date('2020-01-05T00:00:00.000Z');
      const b = new Date('2020-01-01T00:00:00.000Z');
      const diff = dateDifference(a, b);
      expect(Math.round(diff)).toBe(4); // about 4 days
    });

    test('groupedPayments groups payments by bill and sums amounts', () => {
      const payments: MeterPayment[] = [
        { meter: 'm1', date: new Date('2020-01-01T00:00:00.000Z'), value: { amount: 10, currency: Currency.EUR }, bill: 'B1' },
        { meter: 'm1', date: new Date('2020-01-05T00:00:00.000Z'), value: { amount: 15, currency: Currency.EUR }, bill: 'B1' },
        { meter: 'm1', date: new Date('2020-02-01T00:00:00.000Z'), value: { amount: 20, currency: Currency.EUR }, bill: 'B2' },
      ];

      const groups = groupedPayments(payments as any);
      // Should return one group per bill
      const bills = groups.map(g => g.bill).sort();
      expect(bills).toEqual(['B1', 'B2']);

      const b1 = groups.find((g: any) => g.bill === 'B1');
      expect(b1).toBeDefined();
      // from should be earliest date in group, to latest
      expect(b1.from.toISOString()).toBe('2020-01-01T00:00:00.000Z');
      expect(b1.to.toISOString()).toBe('2020-01-05T00:00:00.000Z');
      // sum.amount should be aggregated 10 + 15
      expect(b1.sum.amount).toBe(25);
      expect(b1.sum.currency).toBe(Currency.EUR);
    });

    test('groupedPayments returns [] for empty input', () => {
      expect(groupedPayments([])).toEqual([]);
    });
  });
});