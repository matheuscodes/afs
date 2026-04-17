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
          account: 'acc1',
        } as any,
      ],
    };
    component.setState = jest.fn((update: any) => {
      const patch = typeof update === 'function' ? update(component.state) : update;
      component.state = { ...component.state, ...(patch as any) };
    });
    component.submitActivities();

    expect(component.state.activities).toHaveLength(0);
  });

  test('submitActivities closes the side sheet', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    (component.state as any).isShown = true;
    component.setState = jest.fn((update: any) => {
      const nextState =
        typeof update === 'function' ? update(component.state) : update;
      component.state = nextState as any; // or merge, see below
    });
    component.submitActivities();
    expect(component.state.isShown).toBe(false);
  });

  test('toggleSideSheet toggles visibility state', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    const initial = component.state.isShown;
    component.setState = jest.fn((update: any) => {
      const patch = typeof update === 'function' ? update(component.state) : update;
      component.state = { ...component.state, ...(patch as any) };
    });

    component.toggleSideSheet();
    expect(component.state.isShown).toBe(!initial);
  });

  test('addEmptyActivity appends a new activity with unique id', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    const previousLength = component.state.activities.length;
    const previousIds = component.state.activities.map((activity: any) => activity._id);
    component.setState = jest.fn((update: any) => {
      const patch = typeof update === 'function' ? update(component.state) : update;
      component.state = { ...component.state, ...(patch as any) };
    });

    component.addEmptyActivity();

    expect(component.state.activities).toHaveLength(previousLength + 1);
    const nextIds = component.state.activities.map((activity: any) => activity._id);
    expect(new Set(nextIds).size).toBe(nextIds.length);
    expect(nextIds.some((id) => !previousIds.includes(id))).toBe(true);
  });

  test('defaultAccount returns undefined when accounts are missing', () => {
    const component = new NewActivitiesSheet({ submitActivity: mockSubmitActivity });
    expect(component.defaultAccount()).toBeUndefined();
  });

  test('updateActivity updates only the selected index', () => {
    const component = new NewActivitiesSheet({ accounts: mockAccounts, submitActivity: mockSubmitActivity });
    component.state = {
      ...component.state,
      activities: [
        {
          _id: 1,
          date: new Date('2024-01-15'),
          source: 'Original Source',
          description: 'Original Description',
          value: { amount: 100, currency: Currency.EUR },
          account: 'acc1',
        } as any,
        {
          _id: 2,
          date: new Date('2024-01-16'),
          source: 'Keep Source',
          description: 'Keep Description',
          value: { amount: 200, currency: Currency.EUR },
          account: 'acc2',
        } as any,
      ],
    };
    component.setState = jest.fn((update: any) => {
      const patch = typeof update === 'function' ? update(component.state) : update;
      component.state = { ...component.state, ...(patch as any) };
    });

    component.updateActivity(0, (activity) => ({
      ...activity,
      source: 'Updated Source',
    }));

    expect(component.state.activities[0].source).toBe('Updated Source');
    expect(component.state.activities[1].source).toBe('Keep Source');
  });


});
