import React from 'react'
import './App.css'
import SignInSide from './login'
import { Route, Switch } from 'react-router-dom'

function App () {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={SignInSide}/>
      </Switch>
    </div>

  )
}

export default App
