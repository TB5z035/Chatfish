const { createMuiTheme } = require('@material-ui/core')

export const darkTheme = () =>
  createMuiTheme({
    palette: {
      type: 'dark',
      toolbarBackground: '#333333'
    }
  })

export const THEME_LIGHT = 'THEME_LIGHT'

export const lightTheme = () =>
  createMuiTheme({
    palette: { type: 'light', toolbarBackground: 'linear-gradient(45deg, #ef9a9a 30%, #ffcc80  90%)' }
  })

export const THEME_DARK = 'THEME_DARK'
