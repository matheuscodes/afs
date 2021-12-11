import { updateProperties, updateProperty } from '../actions/investments/property';

function isNotEmpty(str: string) {
  return str &&  str.length > 0;
}

function parse(str: string) {
  return JSON.parse(str);
}

class InvestmentService {
  fetchProperties() {
    return async (dispatch: any, getState: any) => {
      // @ts-ignore
      const data = await window.filesystem.readFile("investments/properties.json");
      const properties = data.split('\n').filter(isNotEmpty).map(parse);

      dispatch(updateProperties(properties));
    }
  }

  fetchProperty(propertyId: string) {
    return async (dispatch: any, getState: any) => {
      let data;

      // @ts-ignore
      data = await window.filesystem.readFile(`investments/properties/${propertyId}/valuations.json`);
      const valuations = data.split('\n').filter(isNotEmpty).map(parse);

      dispatch(updateProperty(propertyId, valuations));
    }
  }
}

export default new InvestmentService();
