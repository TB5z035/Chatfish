import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import chat from './reducers'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import Button from '@material-ui/core/Button'
import { ThemeProvider } from '@material-ui/core'
import { darkTheme } from './themes'

let middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, logger]
}
const store = createStore(chat, applyMiddleware(...middleware))

const notistackRef = React.createRef()
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key)
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <ThemeProvider theme={darkTheme}>
          <SnackbarProvider
            maxSnack={3}
            ref={notistackRef}
            action={(key) => (
              <Button onClick={onClickDismiss(key)}>Dismiss</Button>
            )}
          >
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
