export const INVESTMENT_PROPERTY = "investment-property";
export const UPDATE_PROPERTIES = "update-properties";
export const UPDATE_PROPERTY = "update-property";

export const updateProperties = (properties: any[]) => {
  return {
    type: INVESTMENT_PROPERTY,
    operation: UPDATE_PROPERTIES,
    payload: properties,
  }
}

export const updateProperty = (propertyId: string, valuations: any[]) => {
  return {
    type: INVESTMENT_PROPERTY,
    operation: UPDATE_PROPERTY,
    payload: {
      propertyId,
      valuations,
    },
  }
}
