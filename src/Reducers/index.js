import { combineReducers } from 'redux'

import elevator from './Elevator'
import elevatorManager from './ElevatorManager'

export default combineReducers({
  elevator,
  elevatorManager
})
