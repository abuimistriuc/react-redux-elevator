import * as actions from '../../Actions'

const initialStateE = {
  status: actions.IDLE,
  floor: 0,
  openDoors: false,
  people: 0,
  direction: actions.MOVE_UP
}

const elevator = (state = initialStateE, action) => {
  switch (action.type) {
    case actions.SET_DIRECTION:
      return { ...state, direction: action.direction }
    case actions.MOVE_UP:
      return { ...state, direction: actions.MOVE_UP, floor: state.floor + 1 }
    case actions.MOVE_DOWN:
      return { ...state, direction: actions.MOVE_DOWN, floor: state.floor - 1 }
    case actions.SET_STATUS:
      return { ...state, status: action.status }
    case actions.OPEN_DOORS:
      return { ...state, openDoors: true }
    case actions.CLOSE_DOORS:
      return { ...state, openDoors: false }
    default:
      return state
  }
}


export default elevator
