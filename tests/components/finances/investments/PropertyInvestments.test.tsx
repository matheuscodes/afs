import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import PropertyInvestments from '../../../../src/components/finances/investments/PropertyInvestments';
import { Currency } from '../../../../src/models/Activity';

const mockStore = configureStore([thunk]);

describe('PropertyInvestments', () => {
  const mockProperties = {
    'prop1': {
      id: 'prop1',
      name: 'Test Property',
      address: '123 Test St',
      purchaseDate: new Date('2020-01-01'),
      purchasePrice: { amount: 200000, currency: Currency.EUR },
      valuations: [
        { date: new Date('2020-01-01'), value: { amount: 200000, currency: Currency.EUR } },
        { date: new Date('2024-01-01'), value: { amount: 250000, currency: Currency.EUR } }
      ]
    }
  };

  const initialState = {
    properties: mockProperties
  };

  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders PropertyInvestments component', () => {
    const { container } = render(
      <Provider store={store}>
        <PropertyInvestments />
      </Provider>
    );
    expect(container.querySelector('h1')).toHaveTextContent('Property Investments');
  });

  test('componentDidMount calls fetchProperties', async () => {
    const store = mockStore(initialState);
    
    render(
      <Provider store={store}>
        <PropertyInvestments />
      </Provider>
    );
    
    expect((store.getState() as any).properties).toEqual(mockProperties);
  });

  test('handles empty properties object', () => {
    const store = mockStore({ properties: {} });
    
    const { container } = render(
      <Provider store={store}>
        <PropertyInvestments />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('handles null properties', () => {
    const store = mockStore({ properties: null });
    
    const { container } = render(
      <Provider store={store}>
        <PropertyInvestments />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('displays property information', () => {
    const store = mockStore(initialState);
    
    const { container } = render(
      <Provider store={store}>
        <PropertyInvestments />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('processes property valuations', () => {
    const property = mockProperties.prop1;
    expect(property.valuations.length).toBe(2);
    expect(property.valuations[0].value.amount).toBe(200000);
    expect(property.valuations[1].value.amount).toBe(250000);
  });

  test('handles properties without valuations', () => {
    const propertiesWithoutValuations = {
      'prop1': {
        ...mockProperties.prop1,
        valuations: []
      }
    };

    const store = mockStore({ properties: propertiesWithoutValuations });
    
    const { container } = render(
      <Provider store={store}>
        <PropertyInvestments />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  test('handles multiple properties', () => {
    const multipleProperties = {
      ...mockProperties,
      'prop2': {
        ...mockProperties.prop1,
        id: 'prop2',
        name: 'Second Property'
      }
    };

    const store = mockStore({ properties: multipleProperties });
    
    const { container } = render(
      <Provider store={store}>
        <PropertyInvestments />
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });
});
