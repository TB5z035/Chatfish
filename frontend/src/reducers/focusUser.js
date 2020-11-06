import * as types from '../actions/ActionTypes'

const focusUser = (state = null, action) => {
  switch (action.type) {
    case 'DELETE_FRIEND':
    case 'DELETE_GROUP':
      return null
    case types.SET_FOCUS_USER:
      return action.username
    default:
      return state
  }
}

export default focusUser
