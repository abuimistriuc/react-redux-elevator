import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux';
// import reduxLogger from 'redux-logger'
import reduxThunk from 'redux-thunk';

import Reducers from './Reducers'
import Building from './Components/Building'

const buildingFloors = [
  { no: 5, name: 'Terrace'},
  { no: 4, name: '4'},
  { no: 3, name: '3'},
  { no: 2, name: '2'},
  { no: 1, name: '1'},
  { no: 0, name: '0'}
]

const store = createStore(
  Reducers,
  applyMiddleware(reduxThunk) //, reduxLogger)
)

class App extends Component {
  render() {
    return (
      <div>
        <h4>React Redux Elevator</h4>
        <Provider store={store}>
          <Building floors={buildingFloors} />
        </Provider>
      </div>
    );
  }
}

export default App;
