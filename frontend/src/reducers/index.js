import { combineReducers } from 'redux'
import messages from './messages'
import socket from './socket'
import focusUser from './focusUser'
import theme from './theme'

const chat = combineReducers({
  socket,
  focusUser,
  messages,
  theme
})

export default chat
