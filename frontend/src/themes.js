const { createMuiTheme } = require('@material-ui/core')

export const darkTheme = () =>
  createMuiTheme({
    palette: { type: 'dark' }
  })

export const lightTheme = () =>
  createMuiTheme({
    palette: { type: 'light' }
  })
