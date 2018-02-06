import * as actions from '../../Actions'

const initialStateEM = {
  requestedUp: {},
  requestedDown: {},
  requestedStop: {}
}

const immutableDeleteKey = (object, key) => {
  let obj = {...object}
  delete(obj[key])
  return {...obj}
}

const loadPeopleFromFloor = (state, floor) => ({
  requestedUp: immutableDeleteKey(state.requestedUp, floor),
  requestedDown: immutableDeleteKey(state.requestedDown, floor),
  requestedStop: immutableDeleteKey(state.requestedStop, floor)
})

const elevatorManager = (state = initialStateEM, action) => {
  const floor = action.floorNo

  console.log('action: ' + action.type)

  switch (action.type) {
    case actions.OPEN_DOORS:
      return loadPeopleFromFloor(state, action.floorNo)
    case actions.REQUEST_UP:
      const currentNoUp = state.requestedUp[floor] ? state.requestedUp[floor] : 0
      return { ...state, requestedUp: {...state.requestedUp, [floor]: (currentNoUp + 1)} }
    case actions.REQUEST_DOWN:
      const currentNoDown = state.requestedDown[floor] ? state.requestedDown[floor] : 0
      return { ...state, requestedDown: {...state.requestedDown, [floor]: (currentNoDown + 1)} }
    case actions.REQUEST_STOP:
      const currentNoStop = state.requestedStop[floor] ? state.requestedStop[floor] : 0
      return { ...state, requestedStop: {...state.requestedStop, [floor]: (currentNoStop + 1)} }
    default:
      return state
  }
}

export default elevatorManager
