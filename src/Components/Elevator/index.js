import React from 'react'
import { connect } from 'react-redux'

const Elevator = ({ floor, doorsOpen, people, status }) => {
    const elevatorColor = doorsOpen ? '#FF0' : '#AAA'

    return (<ul style={{ backgroundColor: elevatorColor }}>
      <li>People: {people}</li>
      <li>Status: {status}</li>
      <li>Floor: {floor}</li>
    </ul>)
}

export default connect(({ elevator }) => ( elevator ))(Elevator)
