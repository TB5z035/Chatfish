import * as types from '../actions/ActionTypes'
import * as themes from '../themes'

const theme = (state = null, action) => {
  if (action.type === types.SET_THEME) {
    switch (action.theme) {
      case themes.THEME_LIGHT:
        return themes.lightTheme()
      case themes.THEME_DARK:
        return themes.darkTheme()
      default:
        return state
    }
  } else {
    return state
  }
}

export default theme
