import { combineReducers } from 'redux'
import bookkeeping from './bookkeeping'
import accounting from './accounting'

export default combineReducers({
  bookkeeping,
  accounting,
})
