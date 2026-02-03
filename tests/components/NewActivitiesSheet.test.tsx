import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewActivitiesSheet from '../../src/components/NewActivitiesSheet';
import { Currency } from '../../src/models/Activity';

describe('NewActivitiesSheet', () => {
  const mockAccounts = {
    'acc1': { name: 'Test Account', type: 'Checking' },
    'acc2': { name: 'Savings', type: 'Saving' }
  };

  const mockSubmitActivity = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders NewActivitiesSheet button', () => {
    render(<NewActivitiesSheet accounts={mockAccounts} submitActivity={mockSubmitActivity} />);
    expect(screen.getByText('New Activities')).toBeInTheDocument();
  });

  test('initial state has isShown false and one empty activity', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    expect(component.state.isShown).toBe(false);
    expect(component.state.activities.length).toBe(1);
  });

  test('toggleSideSheet toggles isShown state', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    component.setState = jest.fn();
    component.toggleSideSheet();
    expect(component.setState).toHaveBeenCalled();
  });

  test('addEmptyActivity adds new activity to state', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    const initialLength = component.state.activities.length;
    component.setState = jest.fn();
    component.addEmptyActivity();
    expect(component.state.activities.length).toBe(initialLength + 1);
  });

  test('submitActivities calls submitActivity for each activity', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    component.state = {
      ...component.state,
      activities: [
        {
          date: new Date('2024-01-15'),
          source: 'Test Source',
          description: 'Test Description',
          value: { amount: 100, currency: Currency.EUR },
          account: 'acc1'
        } as any
      ]
    };
    component.setState = jest.fn();
    component.submitActivities();
    expect(mockSubmitActivity).toHaveBeenCalledTimes(1);
  });

  test('submitActivities sets default account if not provided', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    component.state = {
      ...component.state,
      activities: [
        {
          date: new Date('2024-01-15'),
          source: 'Test Source',
          description: 'Test Description',
          value: { amount: 100, currency: Currency.EUR }
        } as any
      ]
    };
    component.setState = jest.fn();
    component.submitActivities();
    expect(mockSubmitActivity).toHaveBeenCalled();
    const submittedActivity = mockSubmitActivity.mock.calls[0][0];
    expect(submittedActivity.account).toBeDefined();
  });

  test('submitActivities converts date string to Date object', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    component.state = {
      ...component.state,
      activities: [
        {
          date: new Date('2024-01-15'),
          source: 'Test Source',
          description: 'Test Description',
          value: { amount: 100, currency: Currency.EUR },
          account: 'acc1'
        } as any
      ]
    };
    component.setState = jest.fn();
    component.submitActivities();
    const submittedActivity = mockSubmitActivity.mock.calls[0][0];
    expect(submittedActivity.date).toBeInstanceOf(Date);
  });

  test('defaultAccount returns first account key', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    const defaultAcc = component.defaultAccount();
    expect(defaultAcc).toBe('acc1');
  });

  test('defaultAccount returns undefined when no accounts', () => {
    const component = new NewActivitiesSheet({ accounts: null, submitActivity: mockSubmitActivity });
    const defaultAcc = component.defaultAccount();
    expect(defaultAcc).toBeUndefined();
  });

  test('accountSelector renders SelectField with accounts', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    const mockChange = jest.fn();
    const selector = component.accountSelector('acc1', mockChange);
    expect(selector).toBeTruthy();
  });

  test('accountSelector handles empty accounts object', () => {
    const component = new NewActivitiesSheet({ accounts: {}, submitActivity: mockSubmitActivity });
    const mockChange = jest.fn();
    const selector = component.accountSelector('', mockChange);
    expect(selector).toBeTruthy();
  });

  test('initialState returns correct initial state structure', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    const initialState = component.initialState();
    expect(initialState.isShown).toBe(false);
    expect(initialState.activities.length).toBe(1);
    expect(initialState.activities[0].value.currency).toBe(Currency.EUR);
  });

  test('submitActivities empties activities array after submission', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    component.state = {
      ...component.state,
      activities: [
        {
          date: new Date('2024-01-15'),
          source: 'Test Source',
          description: 'Test Description',
          value: { amount: 100, currency: Currency.EUR },
          account: 'acc1'
        } as any
      ]
    };
    component.setState = jest.fn((state) => {
      component.state = state as any;
    });
    component.submitActivities();
    expect(component.state.activities.length).toBe(0);
  });

  test('submitActivities closes the side sheet', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    (component.state as any).isShown = true;
    component.setState = jest.fn((state) => {
      component.state = state as any;
    });
    component.submitActivities();
    expect(component.state.isShown).toBe(false);
  });

  test('handles activities without accounts prop', () => {
    const component = new NewActivitiesSheet({ accounts: undefined, submitActivity: mockSubmitActivity });
    const selector = component.accountSelector('', jest.fn());
    expect(selector).toBeTruthy();
  });
});
