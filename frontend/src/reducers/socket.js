import * as types from '../actions/ActionTypes'

const socket = (state = null, action) => {
  switch (action.type) {
    case types.SET_WEBSOCKET:
      if (action.socket !== undefined) { return action.socket } else return null
    default:
      return state
  }
}

export default socket
