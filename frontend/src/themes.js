const { createMuiTheme } = require('@material-ui/core')

export const THEME_LIGHT = 'THEME_LIGHT'

export const THEME_DARK = 'THEME_DARK'

export const THEME_WHITE = 'THEME_WHITE'

export const themesAvailable = {
  THEME_LIGHT: () =>
    createMuiTheme({
      palette: {
        type: 'light',
        toolbarBackground: 'linear-gradient(45deg, #ef9a9a 30%, #ffcc80  90%)',
        random: require('random-material-color').getColor({
          shades: ['200'],
          text: 'test'
        })
      }
    }),
  THEME_DARK: () =>
    createMuiTheme({
      palette: {
        type: 'dark',
        toolbarBackground: '#333333',
        random: require('random-material-color').getColor({
          shades: ['200'],
          text: 'test'
        })
      }
    }),
  THEME_WHITE: () =>
    createMuiTheme({
      palette: {
        type: 'light',
        toolbarBackground: '#EEEEEE',
        random: require('random-material-color').getColor({
          shades: ['200'],
          text: 'test'
        })
      }
    })
  // More themes can be added here
}
