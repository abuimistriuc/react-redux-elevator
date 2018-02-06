import * as actions from './'

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
export const requestStop = (floorNo) => ({
  type: actions.REQUEST_STOP,
  floorNo
})

// floor panel actions
export const requestUp = (floorNo) => (dispatch) => {
  dispatch({
    type: actions.REQUEST_UP,
    floorNo
  })
  dispatch(processRequests())
}

export const requestDown = (floorNo) => ({
  type: actions.REQUEST_DOWN,
  floorNo
})

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
  processRequests()
}

export const moveUp = () => ({
  type: actions.MOVE_UP
})

// simulate open/close doors with timeout
export const openDoors = (floorNo) => ({
  type: actions.OPEN_DOORS,
  floorNo
})

export const openDoorsRequest = () => (dispatch, getState) => {
  const floorNo = getState().elevator.floor
  elevatorTask(actions.OPENING_DOORS, dispatch, 1000, false).then(() => {
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
  elevatorTask(actions.CLOSING_DOORS, dispatch, 1000).then(() => {
    dispatch(closeDoors())
  })
}
// end doors simulation

export const processRequests = () => (dispatch, getState) => {

  const state = getState()

  // get current elevator status and continue only if it's IDLE
  const status = state.elevator.status
  if (status !== actions.IDLE) {
    return false
  }

  const currentFloor = state.elevator.floor
  const requestedUp = state.elevatorManager.requestedUp
  const requestedDown = state.elevatorManager.requestedDown
  const requestedStop = state.elevatorManager.requestedStop

  // check if doors should open
  // - floor in requestedSTOP
  // - floor in requestedUP and elevator moving UP
  // - floor in requestedDOWN and elevator moving UP
  if (requestedUp[currentFloor] || requestedDown[currentFloor] || requestedStop[currentFloor]) {
    dispatch(openDoorsRequest(currentFloor))
  }

  // check in which direction we should go
  // - first check if we have requestedSTOP or requestUP/DOWN in the same direction
  // - check if there is a requestSTOP or requestUP/DOWN in the other direction
  // - if nothing found set IDLE

}
