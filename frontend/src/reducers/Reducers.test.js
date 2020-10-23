import reducer from './index'
import * as types from '../actions/ActionTypes'
import * as themes from '../themes'
import { THEME_LIGHT } from '../themes'

describe('chat reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        socket: null,
        focusUser: null,
        messages: [],
        myName: null,
        theme: null
      }
    )
  })

  it('should handle setTheme', () => {
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_THEME,
      theme: null
    })).toEqual(
      {
        socket: 'socket',
        focusUser: 'focusUser',
        messages: [],
        myName: 'name',
        theme: null
      }
    )
    reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_THEME,
      theme: THEME_LIGHT
    })
  })

  it('should handle addGroup', () => {
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.ADD_GROUP,
      groupName: 'group'
    })).toEqual(
      {
        socket: 'socket',
        focusUser: 'focusUser',
        messages: [{ user: 'group', message_list: [], isGroup: 1 }],
        myName: 'name',
        theme: null
      }
    )
  })

  it('should handle addFriend', () => {
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.ADD_FRIEND,
      friendName: 'bob'
    })).toEqual(
      {
        socket: 'socket',
        focusUser: 'focusUser',
        messages: [{ user: 'bob', message_list: [], isGroup: 0 }],
        myName: 'name',
        theme: null
      }
    )
  })

  it('should handle setMyName', () => {
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_MY_NAME,
      myName: 'alice'
    })).toEqual(
      {
        socket: 'socket',
        focusUser: 'focusUser',
        messages: [],
        myName: 'alice',
        theme: null
      }
    )
  })

  it('should handle setSocket', () => {
    expect(reducer({
      socket: null,
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_WEBSOCKET,
      socket: 'socket'
    })).toEqual(
      {
        socket: 'socket',
        focusUser: 'focusUser',
        messages: [],
        myName: 'name',
        theme: null
      }
    )
    expect(reducer({
      socket: null,
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_WEBSOCKET,
      socket: undefined
    })).toEqual(
      {
        socket: null,
        focusUser: 'focusUser',
        messages: [],
        myName: 'name',
        theme: null
      }
    )
  })

  it('should handle setMessageList', () => {
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_MESSAGE_LIST,
      messageList: [
        { user: 'bob',
          message_list:
              [{ type: 'normal',
                time: '2020-10-21T06:38:03.063Z',
                from: 'bob',
                content: 'hi' }],
          isGroup: 0 },
        { user: 'alice',
          message_list:
                  [{ type: 'normal',
                    time: '2019-10-21T06:38:03.063Z',
                    from: 'alice',
                    content: 'hello' }],
          isGroup: 0 }
      ]
    })).not.toBeNull()
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_MESSAGE_LIST,
      messageList: [
        { user: 'bob',
          message_list:
                      [],
          isGroup: 0 },
        { user: 'alice',
          message_list:
                      [],
          isGroup: 0 }
      ]
    })).not.toBeNull()
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_MESSAGE_LIST,
      messageList: [
        { user: 'bob',
          message_list:
              [{ type: 'normal',
                time: '2019-10-21T06:38:03.063Z',
                from: 'alice',
                content: 'hello' }],
          isGroup: 0 },
        { user: 'alice',
          message_list:
                      [],
          isGroup: 0 }
      ]
    })).not.toBeNull()
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_MESSAGE_LIST,
      messageList: [
        { user: 'bob',
          message_list:
                      [],
          isGroup: 0 },
        { user: 'alice',
          message_list:
                      [{ type: 'normal',
                        time: '2019-10-21T06:38:03.063Z',
                        from: 'alice',
                        content: 'hello' }],
          isGroup: 0 }
      ]
    })).not.toBeNull()
  })

  it('should handle setFocusUser', () => {
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.SET_FOCUS_USER,
      username: 'carol'
    })).toEqual(
      {
        socket: 'socket',
        focusUser: 'carol',
        messages: [],
        myName: 'name',
        theme: null
      }
    )
  })

  it('should handle messageReceived', () => {
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [],
      myName: 'name',
      theme: null
    }, {
      type: types.NEW_MESSAGE_RECEIVE,
      message: 'hello',
      author: 'bob'
    })).not.toBeNull()
  })

  it('should handle addMessage', () => {
    expect(reducer({
      socket: 'socket',
      focusUser: 'focusUser',
      messages: [{ user: 'name',
        message_list: [{ type: 'normal',
          time: '2019-10-21T06:38:03.063Z',
          from: 'alice',
          content: 'hello' }] },
      { user: 'era',
        message_list: [] }],
      myName: 'name',
      theme: null
    }, {
      type: types.NEW_MESSAGE_SEND,
      message: 'hello',
      author: 'bob',
      receiver: 'name'
    })).not.toBeNull()
  })
})
