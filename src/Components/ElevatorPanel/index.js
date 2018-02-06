import React from 'react'
import { connect } from 'react-redux'

import { requestStop } from '../../Actions/elevator'

const ElevatorPanel = ({ floors, requestedStop, requestStop }) => {
    return (<div style={{ backgroundColor: '#DDD' }}>
      <p>Elevator Panel</p>
      {floors.map(floor => (<button key={floor.no} onClick={() => requestStop(floor.no)}>{floor.no}</button>))}
    </div>)
}

export default connect(
  ({ elevatorManager }) => ({ requestedStop: elevatorManager.requestedStop }),
  { requestStop }
)(ElevatorPanel)
