import * as types from './ActionTypes'

let nextMessageId = 0
// const nextUserId = 0

export const addMessage = (message, author) => ({
  type: types.NEW_MESSAGE_UPDATE,
  id: nextMessageId++,
  message,
  author
})

export const messageReceived = (message, author) => ({
  type: types.NEW_MESSAGE_BROADCAST,
  id: nextMessageId++,
  message,
  author
})

export const setSocket = (socket) => ({
  type: types.SET_WEBSOCKET,
  socket
})

export function connect () {
  return async dispatch => {
    const socket = new WebSocket('ws://localhost:8989')

    socket.onopen = () => {

    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case types.NEW_MESSAGE_BROADCAST:
          dispatch(messageReceived(data.message, data.author))
          break
        default:
          break
      }
    }
    dispatch(setSocket(socket))
    return true
  }
}
