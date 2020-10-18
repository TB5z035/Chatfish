import * as types from './ActionTypes'

export const addMessage = (message, author) => ({
  type: types.NEW_MESSAGE_SEND,
  message,
  author
})

export const messageReceived = (message, author) => ({
  type: types.NEW_MESSAGE_RECEIVE,
  message,
  author
})

export const setSocket = (socket) => ({
  type: types.SET_WEBSOCKET,
  socket
})

