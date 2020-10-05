import * as types from '../actions/ActionTypes'

const socket = (state = null, action) => {
  switch (action.type) {
    case types.SET_WEBSOCKET:
      return action.socket
    default:
      return state
  }
}

export default socket
