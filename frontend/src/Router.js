import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DashBoard from './Board/Dashboard'
import SignInSide from './login'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@material-ui/core'

function Router() {
  const theme = useSelector((state) => state.theme)
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/sign" component={SignInSide}/>
          <Route exact path="/" component={DashBoard}/>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default Router
