import { combineReducers } from 'redux'
import messages from './messages'
import socket from './socket'
import focusUser from './focusUser'
import myName from './myName'
import theme from './theme'
import drawerOpen from './drawerOpen'
import requests from './requests'
import ossClient from './ossClient'

const chat = combineReducers({
  socket,
  focusUser,
  messages,
  myName,
  theme,
  drawerOpen,
  requests,
  ossClient
})

export default chat
