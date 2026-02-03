import BookkeepingService from "../../src/services/BookkeepingService";
import { Currency, Activity } from "../../src/models/Activity";
import { Account, AccountType } from "../../src/models/Account";
import * as actions from "../../src/actions/bookkeeping";
import * as accountingActions from "../../src/actions/accounting";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "UUID_MOCK"),
}));

beforeEach(() => {
  jest.clearAllMocks();
  BookkeepingService.openRequests = {};
});

// --- Tests ---
describe("BookkeepingService", () => {
  it("writeActivity sets openRequests and calls appendData", async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const activity: Activity = {
      date: new Date(),
      transfer: false,
      value: { amount: 10, currency: Currency.EUR },
      category: "Cat",
      account: "A1",
      source: "S1",
      description: "desc",
    };

    const thunkFn = BookkeepingService.writeActivity(activity);
    await thunkFn(dispatch, getState);
    // @ts-ignore
    expect(window.storage.appendData).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: "UUID_MOCK",
        path: "bookkeeping",
        file: activity.date.toJSON().substring(0, 7),
      })
    );

    expect(BookkeepingService.openRequests["UUID_MOCK"]).toEqual(
      expect.objectContaining({
        dispatch,
        action: actions.addActivity,
      })
    );
  });

  it("loadActivities sets openRequests and calls loadAllFiles", async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunkFn = BookkeepingService.loadActivities();
    await thunkFn(dispatch, getState);

    // @ts-ignore
    expect(window.storage.loadAllFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: "UUID_MOCK",
        path: "bookkeeping",
      })
    );

    expect(BookkeepingService.openRequests["UUID_MOCK"]).toEqual(
      expect.objectContaining({
        dispatch,
        action: actions.loadActivities,
      })
    );
  });

  it("loadAccounts sets openRequests and calls loadAllFiles", async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunkFn = BookkeepingService.loadAccounts();
    await thunkFn(dispatch, getState);

    // @ts-ignore
    expect(window.storage.loadAllFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: "UUID_MOCK",
        path: "accounting",
      })
    );

    expect(BookkeepingService.openRequests["UUID_MOCK"]).toEqual(
      expect.objectContaining({
        dispatch,
        action: accountingActions.loadAccounts,
      })
    );
  });

  it("updateData calls dispatch with parsed data", () => {
    const dispatch = jest.fn();
    const dataParser = jest.fn((x) => x);
    BookkeepingService.openRequests["REQ1"] = {
      dispatch,
      action: actions.addActivity,
      dataParser,
    };

    const activity: Activity = {
      date: new Date(),
      transfer: false,
      value: { amount: 42, currency: Currency.EUR },
      category: "Cat",
      account: "A1",
      source: "S1",
      description: "desc",
    };

    BookkeepingService.updateData({ requestId: "REQ1", data: activity });

    expect(dataParser).toHaveBeenCalledWith(activity);
    expect(dispatch).toHaveBeenCalledWith(actions.addActivity(activity));
  });

  it("monthlyOverview calculates totals correctly", () => {
    const account: Account = { id: "A1", type: AccountType.CHECKING, name: "Checking" };
    const accounts = { A1: account };
    const activity: Activity = {
      date: new Date("2026-01-15"),
      transfer: false,
      value: { amount: 100, currency: Currency.EUR },
      category: "Food",
      account: "A1",
      source: "S1",
      description: "desc",
    };
    const result = BookkeepingService.monthlyOverview(2026, 0, [activity], accounts);

    expect(result.total.income.amount).toBe(100);
    expect(result.total.expenses.amount).toBe(0);
  });

  it("yearlyOverview aggregates activities by category", () => {
    const activity: Activity = {
      date: new Date("2026-03-05"),
      transfer: false,
      value: { amount: -50, currency: Currency.EUR },
      category: "Food",
      account: "A1",
      source: "S1",
      description: "desc",
    };
    const result = BookkeepingService.yearlyOverview([activity]);
    expect(result["2026"].Food.data[2]).toBe(50);
  });

  it("categoryOverview returns summarized categories", () => {
    const report = { Food: { label: "Food", data: [100, 0], backgroundColor: "#123456" } };
    const summary = BookkeepingService.categoryOverview(report as any);
    expect(summary[0].label).toBe("Food");
    expect(summary[0].data[0].y).toBe(100);
  });

  it("categorySources returns categories per source", () => {
    const activity: Activity = {
      date: new Date("2026-01-01"),
      transfer: false,
      value: { amount: -10, currency: Currency.EUR },
      category: "Food",
      account: "A1",
      source: "S1",
      description: "desc",
    };
    const result = BookkeepingService.categorySources([activity], "2026");
    expect(result.Food.S1.data[0]).toBe(10);
  });

  it("categoryDescriptions returns categories per description", () => {
    const activity: Activity = {
      date: new Date("2026-01-01"),
      transfer: false,
      value: { amount: -10, currency: Currency.EUR },
      category: "Food",
      account: "A1",
      source: "S1",
      description: "Desc1",
    };
    const result = BookkeepingService.categoryDescriptions([activity], "2026");
    expect(result.Food.Desc1.data[0]).toBe(10);
  });
});
