import { combineReducers } from 'redux'
import messages from './messages'
import socket from './socket'
import focusUser from './focusUser'

const chat = combineReducers({
  socket,
  focusUser,
  messages
})

export default chat
