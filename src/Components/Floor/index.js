import React from 'react'
import { connect } from 'react-redux'

import './style.css'
import { requestUp, requestDown } from '../../Actions/elevator'

const Floor =  ({ floor, elevatorFloor, requestUp, requestDown, requestsUp, requestsDown, requestsStop }) => {
  return (
    <div className='floor'>
      <button disabled style={elevatorFloor === floor.no ? ({backgroundColor: '#5AF'}) : ({})}>{floor.name}</button>
      <button onClick={() => requestDown(floor.no)}>
        <i className="fa fa-angle-down"></i>
        {requestsDown ? requestsDown : null}
      </button>
      <button onClick={() => requestUp(floor.no)}>
        <i className="fa fa-angle-up"></i>
        {requestsUp ? requestsUp : null}
      </button>
    </div>
  )
}

export default connect(
   ({ elevator, elevatorManager }, { floor }) => ({
    elevatorFloor: elevator.floor,
    requestsUp: elevatorManager.requestedUp[floor.no],
    requestsDown: elevatorManager.requestedDown[floor.no],
    requestsStop: elevatorManager.requestedStop[floor.no]
  }),
  { requestUp, requestDown }
)(Floor)
