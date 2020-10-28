import * as types from '../actions/ActionTypes'

const drawerOpen = (state = false, action) => {
  switch (action.type) {
    case types.SET_DRAWER_OPEN:
      return action.open
    default:
      return state
  }
}

export default drawerOpen
