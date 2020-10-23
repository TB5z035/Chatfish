import * as actions from './index'
import * as types from './ActionTypes'

describe('actions', () => {
  it('should create actions setTheme', () => {
    const theme = 'Light'
    const expectedAction = {
      type: types.SET_THEME,
      theme
    }
    expect(actions.setTheme(theme)).toEqual(expectedAction)
  })
  it('should create actions addGroup', () => {
    const groupName = 'name'
    const expectedAction = {
      type: types.ADD_GROUP,
      groupName
    }
    expect(actions.addGroup(groupName)).toEqual(expectedAction)
  })
  it('should create actions addFriend', () => {
    const friendName = 'name'
    const expectedAction = {
      type: types.ADD_FRIEND,
      friendName
    }
    expect(actions.addFriend(friendName)).toEqual(expectedAction)
  })
  it('should create actions setMyName', () => {
    const name = 'name'
    const expectedAction = {
      type: types.SET_MY_NAME,
      myName: name
    }
    expect(actions.setMyName(name)).toEqual(expectedAction)
  })
  it('should create actions setSocket', () => {
    const socket = 'socket'
    const expectedAction = {
      type: types.SET_WEBSOCKET,
      socket
    }
    expect(actions.setSocket(socket)).toEqual(expectedAction)
  })
  it('should create actions setMessageList', () => {
    const messageList = {}
    const expectedAction = {
      type: types.SET_MESSAGE_LIST,
      messageList
    }
    expect(actions.setMessageList(messageList)).toEqual(expectedAction)
  })
  it('should create actions setFocusUser', () => {
    const username = 'name'
    const expectedAction = {
      type: types.SET_FOCUS_USER,
      username
    }
    expect(actions.setFocusUser(username)).toEqual(expectedAction)
  })
  it('should create actions messageReceived', () => {
    const author = 'name'
    const message = 'hello'
    const expectedAction = {
      type: types.NEW_MESSAGE_RECEIVE,
      message,
      author
    }
    expect(actions.messageReceived(message, author)).toEqual(expectedAction)
  })
  it('should create actions addMessage', () => {
    const author = 'alice'
    const message = 'hello'
    const receiver = 'bob'
    const expectedAction = {
      type: types.NEW_MESSAGE_SEND,
      message,
      author,
      receiver
    }
    expect(actions.addMessage(message, author, receiver)).toEqual(expectedAction)
  })
})
