import { Home, MeterPrice, Heater } from '../../models/Home'
import { HOME_CONSUMPTION, UPDATE_HOMES, UPDATE_ELECTRICITY, UPDATE_GAS, UPDATE_WATER, UPDATE_HEATING } from '../../actions/consumption/home'

export default (state: Record<string, Home> = {}, action: any) => {
  console.log("home reducer", action);
  const sortByDateAsc = (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  const sortByDateDesc = (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  if(action.type === HOME_CONSUMPTION) {
    switch (action.operation) {
      case UPDATE_HOMES:
        const homes: Record<string, Home> = {};
        action.payload.forEach((i: Home) => homes[i.id] = {...i});
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
      case UPDATE_WATER:
        const waterHome = state[action.payload.homeId]

        if(!waterHome.water) return state;

        action.payload.prices
          .filter((i: MeterPrice) =>
          (waterHome.water.cold && waterHome.water.cold.id === i.meter) ||
          (waterHome.water.warm && waterHome.water.warm.id === i.meter) )
          .sort(sortByDateDesc)
          .forEach( (price: MeterPrice) => {
            const thisMeter = (i: any) =>  i.meter === price.meter

            if(waterHome.water.cold) {
              if(!waterHome.water.cold.prices) {
                waterHome.water.cold.prices = [];
              }

              waterHome.water.cold.prices.push(price);

              // Dumb assign, for every price, it is copied/overwritten again.
              waterHome.water.cold.payments = action.payload.payments.filter(thisMeter).sort(sortByDateAsc)
              waterHome.water.cold.measurements = action.payload.measurements.filter(thisMeter).sort(sortByDateAsc)
            }

            if(waterHome.water.warm) {
              if(!waterHome.water.warm.prices) {
                waterHome.water.warm.prices = [];
              }

              waterHome.water.warm.prices.push(price);

              // Dumb assign, for every price, it is copied/overwritten again.
              waterHome.water.warm.payments = action.payload.payments.filter(thisMeter).sort(sortByDateAsc)
              waterHome.water.warm.measurements = action.payload.measurements.filter(thisMeter).sort(sortByDateAsc)
            }

          })

        return {...state}
      case UPDATE_HEATING:
        const heatingHome = state[action.payload.homeId]

        if(!heatingHome.heaters) return state;

        action.payload.prices
          .filter((i: MeterPrice) => heatingHome.heaters[i.meter])
          .sort(sortByDateDesc)
          .forEach( (price: MeterPrice) => {
            if(!heatingHome.heaters[price.meter].prices) {
              heatingHome.heaters[price.meter].prices = [];
            }
            heatingHome.heaters[price.meter].prices.push(price);
            const thisMeter = (i: any) =>  i.meter === price.meter
            // Dumb assign, for every price, it is copied/overwritten again.
            heatingHome.heaters[price.meter].payments = action.payload.payments.filter(thisMeter).sort(sortByDateAsc)
            heatingHome.heaters[price.meter].measurements = action.payload.measurements.filter(thisMeter).sort(sortByDateAsc)
          })

        return {...state}
      default:
        return state;
    }
  }
  return state;
};
