import * as types from '../actions/ActionTypes'
import * as themes from '../themes'

const theme = (state = null, action) => {
  if (action.type === types.SET_THEME) {
    if (themes.themesAvailable.includes(action.theme)) {
      return action.theme.setTheme()
    } else {
      return state
    }
  } else {
    return state
  }
}

export default theme
