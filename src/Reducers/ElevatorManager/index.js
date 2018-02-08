import * as actions from '../../Actions'
import _ from 'lodash'

const initialStateEM = {
  requestedUp: {},
  requestedDown: {},
  requestedStop: {},
  waitingForStopRequest: false
}

const immutableDeleteKey = (object, key) => {
  let obj = {...object}
  delete(obj[key])
  return {...obj}
}

// load people and check if we still have requests in that direction or we need to wait for a button pressed in the elevator
const loadPeopleFromFloor = (state, floor, direction) => {
  const hasRequestsUpper = _.filter(state.requestedUp, (val) => (val > floor)).length
  const hasRequestsLower = _.filter(state.requestedDown, (val) => (val < floor)).legth

  let waitingForStopRequest = false
  let requestedUp = { ...state.requestedUp }
  let requestedDown = { ...state.requestedDown }
  const requestedStop = immutableDeleteKey(state.requestedStop, floor)

  if (direction === actions.MOVE_UP && requestedUp[floor]) {
    requestedUp = immutableDeleteKey(requestedUp, floor)
    if (!hasRequestsUpper) {
      waitingForStopRequest = true
    }
  }
  if (direction === actions.MOVE_DOWN && requestedDown[floor]) {
    requestedDown = immutableDeleteKey(requestedDown, floor)
    if (!hasRequestsLower) {
      waitingForStopRequest = true
    }
  }

  return {
    requestedUp,
    requestedDown,
    requestedStop,
    waitingForStopRequest
  }
}

const elevatorManager = (state = initialStateEM, action) => {
  const floor = action.floorNo

  switch (action.type) {
    case actions.MOVE_UP:
    case actions.MOVE_DOWN:
      return { ...state, waitingForStopRequest: false }
    case actions.OPEN_DOORS:
      return loadPeopleFromFloor(state, action.floorNo, action.direction)
    case actions.REQUEST_UP:
      const currentNoUp = state.requestedUp[floor] ? state.requestedUp[floor] : 0
      return { ...state, requestedUp: {...state.requestedUp, [floor]: (currentNoUp + 1)} }
    case actions.REQUEST_DOWN:
      const currentNoDown = state.requestedDown[floor] ? state.requestedDown[floor] : 0
      return { ...state, requestedDown: {...state.requestedDown, [floor]: (currentNoDown + 1)} }
    case actions.REQUEST_STOP:
      const currentNoStop = state.requestedStop[floor] ? state.requestedStop[floor] : 0
      return { ...state, waitingForStopRequest: false, requestedStop: {...state.requestedStop, [floor]: (currentNoStop + 1)} }
    default:
      return state
  }
}

export default elevatorManager
