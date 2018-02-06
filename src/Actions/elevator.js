import _ from 'lodash'

import * as actions from './'

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
export const openDoors = (floorNo) => ({
  type: actions.OPEN_DOORS,
  floorNo
})

export const openDoorsRequest = () => (dispatch, getState) => {
  const floorNo = getState().elevator.floor
  elevatorTask(actions.OPENING_DOORS, dispatch, delay, false).then(() => {
    dispatch(openDoors(floorNo))
    dispatch(closeDoorsRequest())
  })
}

const closeDoors = () => (dispatch) => {
  return ({
    type: actions.CLOSE_DOORS
  })
}

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

  // get current elevator status and continue only if it's IDLE
  const floor = state.elevator.floor
  const status = state.elevator.status
  const direction = state.elevator.direction

  const requestedUp = state.elevatorManager.requestedUp
  const requestedDown = state.elevatorManager.requestedDown
  const requestedStop = state.elevatorManager.requestedStop

  if (status !== actions.IDLE || (!requestedUp && !requestedDown && !requestedStop)) {
    return
  }

  // check if doors should open
  // - floor in requestedSTOP
  // - floor in requestedUP and elevator moving UP
  // - floor in requestedDOWN and elevator moving UP
  if (requestedUp[floor] || requestedDown[floor] || requestedStop[floor]) {
    dispatch(openDoorsRequest(floor))
    return
  }

  // check in which direction we should go
  // - first check if we have requestedSTOP or requestUP/DOWN in the same direction

  // check for stop or request to continue up
  if (direction === actions.MOVE_UP) {
    _.forEach(requestedStop, (value, key) => {
      if (value && key > floor) {
        dispatch(moveUpRequest())
      }
    })

    _.forEach(requestedUp, (value, key) => {
      if (value && key > floor) {
        dispatch(moveUpRequest())
      }
    })
  }

  // check for stop or request to continue down
  if (direction === actions.MOVE_DOWN) {
    _.forEach(requestedStop, (value, key) => {
      if (value && key < floor) {
        dispatch(moveDownRequest())
      }
    })

    _.forEach(requestedDown, (value, key) => {
      if (value && key < floor) {
        dispatch(moveDownRequest())
      }
    })
  }

  // if the elevator is down and no people are tryint to go up
  // we need to move the elevator up if there are people trying to get down
  const maxFloorRequestDown = Math.max(...[Object.keys(requestedDown)])
  if (floor < maxFloorRequestDown ) {
    dispatchAction(setDirection(actions.MOVE_UP))
    dispatch(requestStop(maxFloorRequestDown))
  }

  const minFloorRequestUp = Math.min(...[Object.keys(requestedUp)])
  if (floor < minFloorRequestUp ) {
    dispatchAction(setDirection(actions.MOVE_DOWN))
    dispatch(requestStop(minFloorRequestUp))
  }

  if (direction === actions.MOVE_UP) {
    dispatch(setDirection(actions.MOVE_DOWN))
  } else {
    dispatch(setDirection(actions.MOVE_UP))
  }

  setTimeout(() => dispatch(processRequests()), 10)

  // - check if there is a requestSTOP or requestUP/DOWN in the other direction

}
