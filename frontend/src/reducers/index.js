import { combineReducers } from 'redux'
import messages from './messages'
import socket from './socket'
import focusUser from './focusUser'
import myName from './myName'

const chat = combineReducers({
  socket,
  focusUser,
  messages,
  myName
})

export default chat
