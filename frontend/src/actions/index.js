import * as types from './ActionTypes'

export const addMessage = (message, author, receiver, isGroup) => ({
  type: types.NEW_MESSAGE_SEND,
  message,
  author,
  receiver,
  isGroup
})

export const messageReceived = (message, author, group, isGroup) => ({
  type: types.NEW_MESSAGE_RECEIVE,
  message,
  author,
  group,
  isGroup
})

export const setFocusUser = (username) => ({
  type: types.SET_FOCUS_USER,
  username
})

export const setMessageList = (messageList) => ({
  type: types.SET_MESSAGE_LIST,
  messageList
})

export const setSocket = (socket) => ({
  type: types.SET_WEBSOCKET,
  socket
})

export const setMyName = (myName) => ({
  type: types.SET_MY_NAME,
  myName
})

export const addFriend = (friendName) => ({
  type: types.ADD_FRIEND,
  friendName
})

export const addGroup = (groupName) => ({
  type: types.ADD_GROUP,
  groupName
})

export const setTheme = (theme) => ({
  type: types.SET_THEME,
  theme: theme
})

export const setDrawerOpen = (drawerOpen) => ({
  type: types.SET_DRAWER_OPEN,
  open: drawerOpen
})
