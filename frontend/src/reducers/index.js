import { combineReducers } from 'redux'
import messages from './messages'
import socket from './socket'

const chat = combineReducers({
  socket,
  messages
})

export default chat
