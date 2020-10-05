import * as types from '../actions/ActionTypes'

const users = (state = [], action) => {
  switch (action.type) {
    case types.FRIEND_LIST:
      return action.users
    default:
      return state
  }
}

export default users
