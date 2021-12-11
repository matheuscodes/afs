import { INVESTMENT_PROPERTY, UPDATE_PROPERTIES, UPDATE_PROPERTY } from '../../actions/investments/property'

export default (state: Record<string, any> = {}, action: any) => {
  console.log("investment property reducer", action);
  if(action.type === INVESTMENT_PROPERTY) {
    switch (action.operation) {
      case UPDATE_PROPERTIES:
        const properties:Record<string, any> = {};
        action.payload.forEach((i: any) => properties[i.id] = {...i, valuations: [] as any[]});
        return {...state, ...properties};
      case UPDATE_PROPERTY:
        state[action.payload.propertyId].valuations = [] as any[];
        action.payload.valuations.forEach((entry: any) => state[action.payload.propertyId].valuations.push(entry))
        return JSON.parse(JSON.stringify(state));
      default:
        return state;
    }
  }
  return state;
};
