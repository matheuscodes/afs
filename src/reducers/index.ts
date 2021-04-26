import { combineReducers } from 'redux'
import bookkeeping from './bookkeeping'
import accounting from './accounting'
import cars from './consumption/cars'
import homes from './consumption/homes'

export default combineReducers({
  bookkeeping,
  accounting,
  cars,
  homes,
})
