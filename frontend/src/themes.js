const { createMuiTheme } = require('@material-ui/core')

export const darkTheme = () =>
  createMuiTheme({
    palette: { type: 'dark', dashboard: '#eaaaaa' }
  })

export const lightTheme = () =>
  createMuiTheme({
    palette: { type: 'light' }
  })
