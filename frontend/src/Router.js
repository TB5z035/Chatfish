import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DashBoard from './Board/Dashboard'
import SignInSide from './login'

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/sign" component={SignInSide}/>
      <Route exact path="/" component={DashBoard}/>
    </Switch>
  </BrowserRouter>
)

export default Router
