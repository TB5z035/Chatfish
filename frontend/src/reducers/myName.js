import * as types from '../actions/ActionTypes'

const myName = (state = null, action) => {
  switch (action.type) {
    case types.SET_MY_NAME:
      return action.myName
    default:
      return state
  }
}

export default myName
