import * as types from '../actions/ActionTypes'
import { darkTheme } from '../themes'

const theme = (state = darkTheme, action) => {
  switch (action.type) {
    case types.SET_THEME:
      return action.theme
    default:
      return state
  }
}

export default theme
