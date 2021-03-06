import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../Actions'

const Elevator = ({ floor, people, status, direction, waitingForStopRequest }) => {
    const elevatorColor = (status === actions.OPENING_DOORS || status === actions.CLOSING_DOORS) ? '#FF0' : '#AAA'

    return (<ul style={{ backgroundColor: elevatorColor }}>
      <li>Status: {status}</li>
      <li>Floor: {floor}</li>
      <li>Direction: {direction}</li>
      {waitingForStopRequest && <li style={{backgroundColor: 'red'}}>Waiting Panel Request</li>}
    </ul>)
}

export default connect(
  ({ elevator, elevatorManager }) => ( {...elevator, ...elevatorManager} )
)(Elevator)
