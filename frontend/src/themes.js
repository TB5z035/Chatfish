const { createMuiTheme } = require('@material-ui/core')

export const THEME_LIGHT = {
  name: 'Light',
  type: 'light',
  setTheme: () =>
    createMuiTheme({
      palette: {
        type: 'light',
        toolbarBackground: 'linear-gradient(45deg, #ef9a9a 30%, #ffcc80  90%)',
        chatboxBackground: 'linear-gradient(45deg, #ffebee 30%, #fff8e1 90%)',
        random: require('random-material-color').getColor({
          shades: ['200'],
          text: 'test'
        })
      }
    })
}

export const THEME_DARK = {
  name: 'Dark',
  type: 'dark',
  setTheme: () =>
    createMuiTheme({
      palette: {
        type: 'dark',
        toolbarBackground: '#333333',
        // chatboxBackground: theme.palette.background.paper,
        random: require('random-material-color').getColor({
          shades: ['200'],
          text: 'test'
        })
      }
    })
}

export const THEME_WHITE = {
  name: 'White',
  type: 'light',
  setTheme: () =>
    createMuiTheme({
      palette: {
        type: 'light',
        toolbarBackground: '#EEEEEE',
        // chatboxBackground: theme.palette.background.paper,
        random: require('random-material-color').getColor({
          shades: ['200'],
          text: 'test'
        })
      }
    })
}

export const themesAvailable = [
  THEME_LIGHT,
  THEME_DARK,
  THEME_WHITE
  // More themes can be added here
]

export const themeLightDefault = THEME_LIGHT

export const themeDarkDefault = THEME_DARK
