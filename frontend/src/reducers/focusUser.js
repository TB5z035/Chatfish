import * as types from '../actions/ActionTypes'

const focusUser = (state = null, action) => {
  switch (action.type) {
    case types.SET_FOCUS_USER:
      return action.username
    default:
      return state
  }
}

export default focusUser
