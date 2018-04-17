import { combineReducers } from 'redux'

import sample from './sample.reducer'
import socketPage from './socketPage'

export default combineReducers({
  sample,
  socketPage
})
