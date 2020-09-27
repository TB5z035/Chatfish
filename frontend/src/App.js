import React from 'react'
import logo from './logo.svg'
import './App.css'
import Button from '@material-ui/core/Button'
import SignInSide from './login'

function App () {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      <body>
        <SignInSide></SignInSide>
      </body>
    </div>
  )
}

export default App
