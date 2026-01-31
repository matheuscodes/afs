import InvestmentsService from '../../src/services/InvestmentsService';

jest.mock('../../src/actions/investments/property', () => ({
  updateProperties: jest.fn((properties: any[]) => ({ type: 'UPDATE_PROPERTIES', payload: properties })),
  updateProperty: jest.fn((propertyId: string, valuations: any[]) => ({ type: 'UPDATE_PROPERTY', payload: { propertyId, valuations } })),
}));

import { updateProperties, updateProperty } from '../../src/actions/investments/property';

describe('InvestmentsService', () => {
  const originalWindow = (global as any).window;

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).window = originalWindow || {};
    (global as any).window.filesystem = {
      readFile: jest.fn(),
    };
  });

  afterEach(() => {
    (global as any).window = originalWindow;
  });

  test('fetchProperties parses multiple JSON lines, skipping empty lines, and dispatches updateProperties', async () => {
    const fileContent = '{"id":1}\n\n{"id":2}\n';
    (global as any).window.filesystem.readFile.mockResolvedValue(fileContent);

    const dispatch = jest.fn();
    await InvestmentsService.fetchProperties()(dispatch, jest.fn());

    expect((global as any).window.filesystem.readFile).toHaveBeenCalledWith('investments/properties.json');
    expect((updateProperties as jest.Mock).mock.calls.length).toBe(1);
    expect((updateProperties as jest.Mock).mock.calls[0][0]).toEqual([{ id: 1 }, { id: 2 }]);
    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_PROPERTIES', payload: [{ id: 1 }, { id: 2 }] });
  });

  test('fetchProperties handles completely empty file and dispatches empty array', async () => {
    (global as any).window.filesystem.readFile.mockResolvedValue('');

    const dispatch = jest.fn();
    await InvestmentsService.fetchProperties()(dispatch, jest.fn());

    expect((updateProperties as jest.Mock).mock.calls.length).toBe(1);
    expect((updateProperties as jest.Mock).mock.calls[0][0]).toEqual([]);
    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_PROPERTIES', payload: [] });
  });

  test('fetchProperty reads valuations, parses them and dispatches updateProperty', async () => {
    const propertyId = 'prop-42';
    const valuations = '{"v":100}\n\n{"v":200}\n';
    (global as any).window.filesystem.readFile.mockResolvedValueOnce(valuations);

    const dispatch = jest.fn();
    await InvestmentsService.fetchProperty(propertyId)(dispatch, jest.fn());

    expect((global as any).window.filesystem.readFile).toHaveBeenCalledWith(`investments/properties/${propertyId}/valuations.json`);
    expect((updateProperty as jest.Mock).mock.calls.length).toBe(1);
    const callArgs = (updateProperty as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBe(propertyId);
    expect(callArgs[1]).toEqual([{ v: 100 }, { v: 200 }]);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_PROPERTY',
      payload: { propertyId, valuations: [{ v: 100 }, { v: 200 }] },
    });
  });

  test('fetchProperty handles newline-only or empty valuations and dispatches empty array', async () => {
    const propertyId = 'prop-empty';
    const rf = (global as any).window.filesystem.readFile;
    // Test newline-only
    rf.mockResolvedValueOnce('\n');

    const dispatch1 = jest.fn();
    await InvestmentsService.fetchProperty(propertyId)(dispatch1, jest.fn());
    expect((updateProperty as jest.Mock).mock.calls.length).toBe(1);
    expect((updateProperty as jest.Mock).mock.calls[0][1]).toEqual([]);
    expect(dispatch1).toHaveBeenCalledWith({
      type: 'UPDATE_PROPERTY',
      payload: { propertyId, valuations: [] },
    });

    // Reset mocks and test empty string
    jest.clearAllMocks();
    rf.mockResolvedValueOnce('');

    const dispatch2 = jest.fn();
    await InvestmentsService.fetchProperty(propertyId)(dispatch2, jest.fn());
    expect((updateProperty as jest.Mock).mock.calls.length).toBe(1);
    expect((updateProperty as jest.Mock).mock.calls[0][1]).toEqual([]);
    expect(dispatch2).toHaveBeenCalledWith({
      type: 'UPDATE_PROPERTY',
      payload: { propertyId, valuations: [] },
    });
  });
});