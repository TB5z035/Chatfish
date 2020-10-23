import React from 'react'
import { createStore } from 'redux'
import reducer from '../reducers'
// import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import Dashboard from './Dashboard'
import { SnackbarProvider } from 'notistack'
import { render } from '../testUtils'
// import { render, fireEvent, screen } from '../testUtils'
it('Renders the connected app with initialState', () => {
  const div = document.createElement('div')
  const store = createStore(reducer)
  render(<div>
    <Provider store={store}>
      <SnackbarProvider>
        <Dashboard/>
      </SnackbarProvider>
    </Provider>
  </div>, { initialState: {
    socket: null,
    focusUser: 'name',
    messages: [{ user: 'name',
      message_list: [{ type: 'normal',
        time: '2019-10-21T06:38:03.063Z',
        from: 'alice',
        content: 'hello' }] },
    { user: 'era',
      message_list: [] }],
    myName: 'alice',
    theme: null
  } })
})
