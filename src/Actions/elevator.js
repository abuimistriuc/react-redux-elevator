import * as actions from './'
import _ from 'lodash'

const delay = 1000

// elevator task simulator
const elevatorTask = (task, dispatch, ms, autostop = true) => {
  dispatch(startTask(task))
  return new Promise(resolve => setTimeout(() => {
    if (autostop) {
      dispatch(endTask())
    }
    resolve('task completed')
  }, ms))
}

// elevator panel actions
export const requestStop = (floorNo) => dispatch => {
  dispatch({
    type: actions.REQUEST_STOP,
    floorNo
  })
  dispatch(processRequests())
}

// floor panel actions
export const requestUp = (floorNo) => (dispatch) => {
  dispatch({
    type: actions.REQUEST_UP,
    floorNo
  })
  dispatch(processRequests())
}

export const requestDown = (floorNo) => (dispatch) => {
  dispatch({
    type: actions.REQUEST_DOWN,
    floorNo
  })
  dispatch(processRequests())
}

// elevator actions
export const startTask = (task) => ({
  type: actions.SET_STATUS,
  status: task
})

export const endTask = () => (dispatch) => {
  dispatch({
    type: actions.SET_STATUS,
    status: actions.IDLE
  })
}

// simulate elevator moving
export const moveUp = () => ({
  type: actions.MOVE_UP
})

export const moveUpRequest = () => (dispatch, getState) => {
  elevatorTask(actions.MOVING_UP, dispatch, delay).then(() => {
    dispatch(moveUp())
    dispatch(processRequests())
  })
}

export const moveDown = () => ({
  type: actions.MOVE_DOWN
})

export const moveDownRequest = () => (dispatch, getState) => {
  elevatorTask(actions.MOVING_DOWN, dispatch, delay).then(() => {
    dispatch(moveDown())
    dispatch(processRequests())
  })
}

export const setDirection = (direction) => ({
  type: actions.SET_DIRECTION,
  direction
})

// simulate open/close doors with timeout
export const openDoors = (floorNo, direction) => ({
  type: actions.OPEN_DOORS,
  floorNo,
  direction
})

export const openDoorsRequest = () => (dispatch, getState) => {
  const floorNo = getState().elevator.floor
  const direction = getState().elevator.direction
  elevatorTask(actions.OPENING_DOORS, dispatch, delay, false).then(() => {
    dispatch(openDoors(floorNo, direction))
    dispatch(closeDoorsRequest())
  })
}

const closeDoors = () => ({
    type: actions.CLOSE_DOORS
})

export const closeDoorsRequest = () => (dispatch) => {
  elevatorTask(actions.CLOSING_DOORS, dispatch, delay).then(() => {
    dispatch(closeDoors())
    dispatch(processRequests())
  })
}
// end doors simulation

export const processRequests = () => (dispatchAction, getState) => {

  const state = getState()

  let dispatched = false;

  const dispatch = (action) => {
    if (!dispatched) {
      dispatchAction(action)
    }
    dispatched = true
  }

  const floor = state.elevator.floor
  const status = state.elevator.status
  const direction = state.elevator.direction

  const { requestedUp, requestedDown, requestedStop, waitingForStopRequest } = state.elevatorManager

  const hasRequests = !_.isEmpty({...requestedUp,...requestedDown,...requestedStop})

  if (status !== actions.IDLE || !hasRequests) {
    return
  }

  console.log('process', {...requestedUp,...requestedDown,...requestedStop})

  // check if doors should open to leave or load people
  // - floor in requestedSTOP
  // - floor in requestedUP and elevator moving UP
  // - floor in requestedDOWN and elevator moving UP
  if (
        (requestedUp[floor] && direction === actions.MOVE_UP)
        || (requestedDown[floor] && direction === actions.MOVE_DOWN)
        || requestedStop[floor]
    ) {
    dispatch(openDoorsRequest(floor))
    return

  // check if requests up
  } else if (direction === actions.MOVE_UP) {
    const maxFloorRequest = Math.max(0,...Object.keys(requestedStop), ...Object.keys(requestedDown), ...Object.keys(requestedUp))
    if (floor < maxFloorRequest ) {
      dispatch(moveUpRequest())
      return
    }
  // check if requests down
  } else if (direction === actions.MOVE_DOWN) {
    const minFloorRequest = Math.min(100,...Object.keys(requestedStop), ...Object.keys(requestedDown), ...Object.keys(requestedUp))
    if (floor > minFloorRequest) {
      dispatch(moveDownRequest())
      return
    }
  }

  if (hasRequests && !waitingForStopRequest) {
    if (direction === actions.MOVE_UP) {
      dispatch(setDirection(actions.MOVE_DOWN))
    } else {
      dispatch(setDirection(actions.MOVE_UP))
    }
    setTimeout(() => dispatchAction(processRequests()), 1000)
  }


}
