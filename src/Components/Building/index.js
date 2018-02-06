import React from 'react'

import Floor from '../Floor'
import Elevator from '../Elevator'
import ElevatorPanel from '../ElevatorPanel'

export default ({ floors }) => (
  <div>
    <div style={{ border: '1px black' }}>
      {floors.map( (floor, index) => <Floor key={floor.no} floor={floor} /> )}
    </div>
    <Elevator />
    <ElevatorPanel floors={floors} />
  </div>
)
