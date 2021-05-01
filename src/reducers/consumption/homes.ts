import { Home, MeterPrice, Heater } from '../../models/Home'
import { HOME_CONSUMPTION, UPDATE_HOMES, UPDATE_ELECTRICITY } from '../../actions/consumption/home'

export default (state: Record<string, Home> = {}, action: any) => {
  console.log("home reducer", action);
  if(action.type === HOME_CONSUMPTION) {
    switch (action.operation) {
      case UPDATE_HOMES:
        const homes: Record<string, Home> = {};
        action.payload.forEach((i: Home) => homes[i.id] = {
          ...i,
          heaters: [] as Heater[],
        });
        return {...state, ...homes};
      case UPDATE_ELECTRICITY:
        const sortByDateAsc = (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        const sortByDateDesc = (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        const { homeId, payments, measurements, prices } = action.payload
        const home = state[homeId]
        home.electricity = {}
        prices.sort(sortByDateDesc).forEach( (price: MeterPrice) => {
          if(!home.electricity[price.meter]) {
            home.electricity[price.meter] = {
              prices: [],
            }
          }
          home.electricity[price.meter].prices.push(price);
          const thisMeter = (i: any) =>  i.meter === price.meter
          // Dumb assign, for every price, it is copied/overwritten again.
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
