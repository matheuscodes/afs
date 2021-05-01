import { Home, MeterPrice, Heater } from '../../models/Home'
import { HOME_CONSUMPTION, UPDATE_HOMES, UPDATE_ELECTRICITY, UPDATE_GAS } from '../../actions/consumption/home'

export default (state: Record<string, Home> = {}, action: any) => {
  console.log("home reducer", action);
  const sortByDateAsc = (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  const sortByDateDesc = (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
      case UPDATE_GAS:
        const gasHome = state[action.payload.homeId]

        if(!gasHome.gas) return state;

        action.payload.prices
          .filter((i: MeterPrice) => gasHome.gas[i.meter])
          .sort(sortByDateDesc)
          .forEach( (price: MeterPrice) => {
            if(!gasHome.gas[price.meter].prices) {
              gasHome.gas[price.meter].prices = [];
            }
            gasHome.gas[price.meter].prices.push(price);
            const thisMeter = (i: any) =>  i.meter === price.meter
            // Dumb assign, for every price, it is copied/overwritten again.
            gasHome.gas[price.meter].payments = action.payload.payments.filter(thisMeter).sort(sortByDateAsc)
            gasHome.gas[price.meter].measurements = action.payload.measurements.filter(thisMeter).sort(sortByDateAsc)
          })

        return {...state}
      default:
        return state;
    }
  }
  return state;
};
