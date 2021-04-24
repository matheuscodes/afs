import { combineReducers } from 'redux'
import bookkeeping from './bookkeeping'
import accounting from './accounting'
import cars from './consumption/cars'

export default combineReducers({
  bookkeeping,
  accounting,
  cars,
})
