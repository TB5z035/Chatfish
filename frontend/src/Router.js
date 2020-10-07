import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DashBoard from './Board/Dashboard'
import SignInSide from './login'


const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={SignInSide}/>
      <Route exact path="/chat" component={DashBoard}/>
    </Switch>
  </BrowserRouter>
)

export default Router
