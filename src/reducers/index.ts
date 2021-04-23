import { combineReducers } from 'redux'
import bookkeeping from './bookkeeping'
import accounting from './accounting'
import car from './consumption/car'

export default combineReducers({
  bookkeeping,
  accounting,
  car,
})
