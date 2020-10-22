import { combineReducers } from 'redux'
import messages from './messages'
import socket from './socket'
import focusUser from './focusUser'
import myName from './myName'
import theme from './theme'

const chat = combineReducers({
  socket,
  focusUser,
  messages,
  myName,
  theme
})

export default chat
