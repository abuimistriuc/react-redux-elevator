import React from 'react'

import Floor from '../Floor'
import Elevator from '../Elevator'

export default ({ floors }) => (
  <div>
    <div style={{ border: '1px black' }}>
      {floors.map( (floor, index) => <Floor key={floor.no} floor={floor} /> )}
    </div>
    <Elevator />
  </div>
)
