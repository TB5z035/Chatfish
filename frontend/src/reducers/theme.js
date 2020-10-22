import * as types from '../actions/ActionTypes'
import * as themes from '../themes'

const theme = (state = null, action) => {
  if (action.type === types.SET_THEME) {
    // switch (action.theme) {
    //   case themes.THEME_LIGHT:
    //     return themes.lightTheme()
    //   case themes.THEME_DARK:
    //     return themes.darkTheme()
    //   default:
    //     return state
    // }
    console.log("yes1")
    if (themes.themesAvailable.includes(action.theme)) {
      console.log("yes2")
      return action.theme.setTheme()
    } else {
      return state
    }
  } else {
    return state
  }
}

export default theme
