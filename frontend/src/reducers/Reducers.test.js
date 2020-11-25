import reducer from './index'
import * as types from '../actions/ActionTypes'
import { THEME_LIGHT, THEME_DARK, THEME_WHITE } from '../themes'

describe('chat reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).not.toBeNull()
  })

  it('should handle setTheme', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: { user: 'name', isGroup: 0 },
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_THEME,
          theme: null
        }
      )
    ).not.toBeNull()
    reducer(
      {
        socket: 'socket',
        focusUser: 'focusUser',
        messages: { messageList: [], focusUser: null },
        myName: 'name',
        theme: null,
        drawerOpen: false
      },
      {
        type: types.SET_THEME,
        theme: THEME_LIGHT
      }
    )
    reducer(
      {
        socket: 'socket',
        focusUser: 'focusUser',
        messages: { messageList: [], focusUser: null },
        myName: 'name',
        theme: null,
        drawerOpen: false
      },
      {
        type: types.SET_THEME,
        theme: THEME_DARK
      }
    )
    reducer(
      {
        socket: 'socket',
        focusUser: 'focusUser',
        messages: { messageList: [], focusUser: null },
        myName: 'name',
        theme: null,
        drawerOpen: false
      },
      {
        type: types.SET_THEME,
        theme: THEME_WHITE
      }
    )
  })

  it('should handle addGroup', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.ADD_GROUP,
          groupName: 'group'
        }
      )
    ).not.toBeNull()
  })

  it('should handle addFriend', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.ADD_FRIEND,
          friendName: 'bob'
        }
      )
    ).not.toBeNull()
  })

  it('should handle setMyName', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_MY_NAME,
          myName: 'alice'
        }
      )
    ).not.toBeNull()
  })

  it('should handle setSocket', () => {
    expect(
      reducer(
        {
          socket: null,
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_WEBSOCKET,
          socket: 'socket'
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: null,
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_WEBSOCKET,
          socket: undefined
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: null,
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_DRAWER_OPEN,
          open: true
        }
      )
    ).not.toBeNull()
  })

  it('should handle setMessageList', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_MESSAGE_LIST,
          messageList: [
            {
              user: 'bob',
              message_list: [
                {
                  type: 'normal',
                  time: '2020-10-21T06:38:03.063Z',
                  from: 'bob',
                  content: 'hi'
                }
              ],
              isGroup: 0
            },
            {
              user: 'alice',
              message_list: [
                {
                  type: 'normal',
                  time: '2019-10-21T06:38:03.063Z',
                  from: 'alice',
                  content: 'hello'
                }
              ],
              isGroup: 0
            }
          ]
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [
            {
              user: 'bob',
              message_list: [
                {
                  type: 'normal',
                  time: '2020-10-21T06:38:03.063Z',
                  from: 'bob',
                  content: 'hi'
                }
              ],
              isGroup: 0
            },
            {
              user: 'alice',
              message_list: [
                {
                  type: 'normal',
                  time: '2019-10-21T06:38:03.063Z',
                  from: 'alice',
                  content: 'hello'
                }
              ],
              isGroup: 0
            }
          ],
          focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.DELETE_FRIEND,
          isGroup: 0,
          friendName: 'alice'
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [
            {
              user: 'bob',
              message_list: [
                {
                  type: 'normal',
                  time: '2020-10-21T06:38:03.063Z',
                  from: 'bob',
                  content: 'hi'
                }
              ],
              isGroup: 0
            },
            {
              user: 'alice',
              message_list: [
                {
                  type: 'normal',
                  time: '2019-10-21T06:38:03.063Z',
                  from: 'alice',
                  content: 'hello'
                }
              ],
              isGroup: 1
            }
          ],
          focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.DELETE_GROUP,
          isGroup: 1,
          groupName: 'alice'
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          messages: { messageList: [
            {
              user: 'bob',
              hidden_ids: [],
              message_list: [
                {
                  type: 'normal',
                  time: '2020-10-21T06:38:03.063Z',
                  from: 'bob',
                  content: 'hi'
                }
              ],
              isGroup: 0
            },
            {
              user: 'alice',
              hidden_ids: [],
              message_list: [
                {
                  type: 'normal',
                  time: '2019-10-21T06:38:03.063Z',
                  from: 'alice',
                  content: 'hello'
                }
              ],
              isGroup: 0
            }
          ],
          focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.RECALL_MESSAGE,
          isGroup: 0,
          friendName: 'alice',
          id: 50
        }
      )
    ).not.toBeNull()

    expect(
      reducer(
        {
          socket: 'socket',
          messages: { messageList: [
            {
              user: 'bob',
              hidden_ids: [],
              friend_offline_ids: [],
              message_list: [
                {
                  type: 'normal',
                  time: '2020-10-21T06:38:03.063Z',
                  from: 'bob',
                  content: 'hi'
                }
              ],
              isGroup: 0
            }
          ],
          focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_ALREADY_READ,
          username: { isGroup: 0,
            friendName: 'bob' },
          id: 50
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_MESSAGE_LIST,
          messageList: [
            { user: 'bob', message_list: [], isGroup: 0 },
            { user: 'alice', message_list: [], isGroup: 0 }
          ]
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_MESSAGE_LIST,
          messageList: [
            {
              user: 'bob',
              message_list: [
                {
                  type: 'normal',
                  time: '2019-10-21T06:38:03.063Z',
                  from: 'alice',
                  content: 'hello'
                }
              ],
              isGroup: 0
            },
            { user: 'alice', message_list: [], isGroup: 0 }
          ]
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_MESSAGE_LIST,
          messageList: [
            { user: 'bob', message_list: [], isGroup: 0 },
            {
              user: 'alice',
              message_list: [
                {
                  type: 'normal',
                  time: '2019-10-21T06:38:03.063Z',
                  from: 'alice',
                  content: 'hello'
                }
              ],
              isGroup: 0
            }
          ]
        }
      )
    ).not.toBeNull()
  })

  it('should handle setFocusUser', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.SET_FOCUS_USER,
          username: 'carol'
        }
      )
    ).not.toBeNull()
  })

  it('should handle messageReceived', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.NEW_MESSAGE_RECEIVE,
          message: 'hello',
          author: 'bob',
          isGroup: 1
        }
      )
    ).not.toBeNull()
  })

  it('should handle addMessage', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false
        },
        {
          type: types.NEW_MESSAGE_SEND,
          message: 'hello',
          author: 'bob',
          receiver: 'name'
        }
      )
    ).not.toBeNull()
  })

  it('should handle addMessage', () => {
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false,
          request: []
        },
        {
          type: types.SET_REQUEST_LIST,
          requests: []
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false,
          request: []
        },
        {
          type: types.ADD_REQUEST
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false,
          request: [{ user: 'test', isGroup: 1, friend_name: 'super' },
            { user: 'test2', isGroup: 1, friend_name: 'super2' }]
        },
        {
          type: types.DELETE_REQUEST,
          isGroup: 1,
          user: 'test'
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false,
          request: [],
          ossClient: null
        },
        {
          type: types.SET_OSS_CLIENT,
          client: ''
        }
      )
    ).not.toBeNull()
    expect(
      reducer(
        {
          socket: 'socket',
          focusUser: 'focusUser',
          messages: { messageList: [], focusUser: null },
          myName: 'name',
          theme: null,
          drawerOpen: false,
          request: [],
          ossClient: null
        },
        {
          type: types.SET_OSS_CLIENT
        }
      )
    ).not.toBeNull()
  })
})
