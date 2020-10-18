import * as types from './ActionTypes'

export const addMessage = (message, author, receiver) => ({
  type: types.NEW_MESSAGE_SEND,
  message,
  author,
  receiver
})

export const messageReceived = (message, author) => ({
  type: types.NEW_MESSAGE_RECEIVE,
  message,
  author
})

export const setFocusUser = (username) => ({
  type: types.SET_FOCUS_USER,
  username
})

export const setMessageList = (messageList) => ({
  type: types.SET_WEBSOCKET,
  messageList
})

export const setSocket = (socket) => ({
  type: types.SET_WEBSOCKET,
  socket
})

