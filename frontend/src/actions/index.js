import * as types from './ActionTypes'

export const addMessage = (message, author, receiver, isGroup, mtype, userInfo) => ({
  type: types.NEW_MESSAGE_SEND,
  message,
  author,
  receiver,
  isGroup,
  mtype,
  userInfo
})

export const messageReceived = (message, author, group, isGroup, mtype, userInfo, id) => ({
  type: types.NEW_MESSAGE_RECEIVE,
  message,
  author,
  group,
  isGroup,
  mtype,
  userInfo,
  id
})

export const setFocusUser = (username) => ({
  type: types.SET_FOCUS_USER,
  username
})

export const setAlreadyRead = (username) => ({
  type: types.SET_ALREADY_READ,
  username
})

export const recallMessage = (friendName, isGroup, id) => ({
  type: types.RECALL_MESSAGE,
  friendName,
  isGroup,
  id
})

export const setMessageList = (messageList) => ({
  type: types.SET_MESSAGE_LIST,
  messageList
})

export const setSocket = (socket) => ({
  type: types.SET_WEBSOCKET,
  socket
})

export const setOSSClient = (client) => ({
  type: types.SET_OSS_CLIENT,
  client: client
})

export const setMyName = (myName) => ({
  type: types.SET_MY_NAME,
  myName
})

export const addFriend = (friendName, userInfo) => ({
  type: types.ADD_FRIEND,
  friendName,
  userInfo
})

export const addGroup = (groupName, userInfo) => ({
  type: types.ADD_GROUP,
  groupName,
  userInfo
})

export const deleteFriend = (friendName) => ({
  type: types.DELETE_FRIEND,
  friendName
})

export const deleteGroup = (groupName) => ({
  type: types.DELETE_GROUP,
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

export const setRequestList = (requests) => ({
  type: types.SET_REQUEST_LIST,
  requests: requests
})

export const addRequest = (isGroup, user, friend) => ({
  type: types.ADD_REQUEST,
  isGroup: isGroup,
  user: user,
  friend_name: friend
})

export const deleteRequest = (isGroup, user) => ({
  type: types.DELETE_REQUEST,
  isGroup: isGroup,
  user: user
})
