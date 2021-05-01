import { Home } from '../models/Home'
import { HOME_CONSUMPTION, UPDATE_HOMES, UPDATE_ELECTRICITY } from '../../actions/consumption/home'

export default (state: Record<string, Home> = {}, action: any) => {
  console.log("home reducer", action);
  if(action.type === HOME_CONSUMPTION) {
    switch (action.operation) {
      case UPDATE_HOMES:
        const homes: Record<string, Home> = {};
        action.payload.forEach((i: Home) => homes[i.id] = {
          ...i,
          heaters: [],
        });
        return {...state, ...homes};
      case UPDATE_ELECTRICITY:
        const sortByDateAsc = (a,b) => new Date(a.date) - new Date(b.date)
        const sortByDateDesc = (a,b) => new Date(b.date) - new Date(a.date)
        const { homeId, payments, measurements, prices } = action.payload
        const home = state[homeId]
        home.electricity = {}
        prices.sort(sortByDateDesc).forEach( price => {
          if(!home.electricity[price.meter]) {
            home.electricity[price.meter] = {
              prices: [],
            }
          }
          home.electricity[price.meter].prices.push(price);
          const thisMeter = i =>  i.meter === price.meter
          home.electricity[price.meter].payments = payments.filter(thisMeter).sort(sortByDateAsc)
          home.electricity[price.meter].measurements = measurements.filter(thisMeter).sort(sortByDateAsc)
        })
        return {...state}
      default:
        return state;
    }
  }
  return state;
};
