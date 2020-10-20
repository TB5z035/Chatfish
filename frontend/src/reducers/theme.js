import * as types from '../actions/ActionTypes'
import {lightTheme} from '../themes'

const theme = (state = lightTheme, action) => {
  switch (action.type) {
    case types.SET_THEME:
      return action.theme
    default:
      return state
  }
}

export default theme
