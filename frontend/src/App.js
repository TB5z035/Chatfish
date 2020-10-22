import React from 'react'
import './App.css'
import Router from './Router'
import { ThemeProvider } from '@material-ui/core'
import { useSelector } from 'react-redux'

function App() {
  const theme = useSelector((state) => state.theme)
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </div>
  )
}

export default App
