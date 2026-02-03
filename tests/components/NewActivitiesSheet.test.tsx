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


});
