import { postEnterChat } from '../fetch/message/enterChat'

const messages = (state = initialState, action) => {
  let newList = [...state.messageList]
  let j = 0
  const len = newList.length
  let isFocus = false
  switch (action.type) {
    case 'DELETE_FRIEND':
      for (; j < len; j++) {
        if (newList[j].isGroup === 0 && newList[j].user === action.friendName) {
          newList.splice(j, 1)
          break
        }
      }
      return { messageList: newList, focusUser: null }
    case 'DELETE_GROUP':
      for (; j < len; j++) {
        if (newList[j].isGroup === 1 && newList[j].user === action.groupName) {
          newList.splice(j, 1)
          break
        }
      }
      return { messageList: newList, focusUser: null }
    case 'ADD_FRIEND':
      return {
        messageList: [
          ...state.messageList,
          {
            user: action.friendName,
            message_list: [],
            isGroup: 0,
            userInfo: action.userInfo,
            offline_ids: [],
            friend_offline_ids: []
          }
        ],
        focusUser: state.focusUser
      }
    case 'ADD_GROUP':
      return {
        messageList: [
          ...state.messageList,
          {
            user: action.groupName,
            message_list: [],
            isGroup: 1,
            userInfo: action.userInfo,
            offline_ids: [],
            friend_offline_ids: []
          }
        ],
        focusUser: state.focusUser
      }

    case 'SET_MESSAGE_LIST':
      newList = action.messageList
      newList.sort((a, b) => {
        if (a.message_list.length === 0) {
          if (b.message_list.length === 0) {
            return 0
          } else return 1
        } else if (b.message_list.length === 0) {
          return -1
        } else {
          return (
            Date.parse(b.message_list.slice(-1)[0].time) -
            Date.parse(a.message_list.slice(-1)[0].time)
          )
        }
      })
      return { messageList: newList, focusUser: state.focusUser }
    case 'NEW_MESSAGE_SEND':
      for (; j < len; j++) {
        if (
          newList[j].user === action.receiver &&
          newList[j].isGroup === action.isGroup
        ) {
          const temp = newList[j]
          newList.splice(j, 1)
          temp.message_list.push({
            from: action.author,
            content: action.message,
            time: new Date().getTime(),
            mtype: action.mtype,
            userInfo: action.userInfo,
            isRead: false,
            id: action.id
          })
          newList.unshift(temp)
        }
      }
      return { messageList: newList, focusUser: state.focusUser }
    case 'NEW_MESSAGE_RECEIVE':
      if (state.focusUser !== null) {
        if (
          state.focusUser.isGroup === 1 &&
          action.isGroup === 1 &&
          state.focusUser.user === action.group
        ) {
          isFocus = true
          postEnterChat(action.group, 1, action.id).then()
        }
        if (
          state.focusUser.isGroup === 0 &&
          action.isGroup === 0 &&
          state.focusUser.user === action.author
        ) {
          isFocus = true
          postEnterChat(action.author, 0, action.id).then()
        }
      }
      for (; j < len; j++) {
        if (
          (newList[j].isGroup === 1 &&
            action.isGroup === 1 &&
            newList[j].user.toString() === action.group.toString()) ||
          (newList[j].isGroup === 0 &&
            action.isGroup === 0 &&
            newList[j].user === action.author)
        ) {
          const temp = newList[j]
          newList.splice(j, 1)
          temp.message_list.push({
            from: action.author,
            content: action.message,
            time: new Date().getTime(),
            mtype: action.mtype,
            userInfo: action.userInfo,
            id: action.id
          })
          if (!isFocus) {
            temp.offline_ids.push(action.id)
          }
          newList.unshift(temp)
        }
      }
      return { messageList: newList, focusUser: state.focusUser }
    case 'SET_ALREADY_READ':
      for (; j < len; j++) {
        if (
          newList[j].isGroup === action.username.isGroup &&
          newList[j].user === action.username.user
        ) {
          newList[j].friend_offline_ids = []
          newList[j].message_list.forEach((item) => {
            item['isRead'] = true
          })
        }
      }
      return { messageList: newList, focusUser: action.username }
    case 'SET_FOCUS_USER':
      for (; j < len; j++) {
        if (
          newList[j].isGroup === action.username.isGroup &&
          newList[j].user === action.username.user
        ) {
          newList[j].offline_ids = []
        }
      }
      return { messageList: newList, focusUser: action.username }
    case 'RECALL_MESSAGE':
      for (; j < len; j++) {
        if (
          newList[j].isGroup === action.isGroup &&
          newList[j].user === action.friendName
        ) {
          newList[j].hidden_ids.push(action.id)
        }
      }
      return { messageList: newList, focusUser: state.focusUser }
    default:
      return state
  }
}

const initialState = {
  messageList: [
    {
      user: 'asg',
      isGroup: 0,
      userInfo: { nickname: 'a', email: '6dsaa@qq.com' },
      offline_ids: [131],
      friend_offline_ids: [],
      hidden_ids: [],
      message_list: [
        {
          from: 'aa',
          mtype: 'gInit',
          content:
            'https://wzf2000-1.oss-cn-hangzhou.aliyuncs.com/' +
            'ChatFish/image/1605171666244/%E6%88%91%E7%9A%84uart_io.v',
          time: 46546515,
          id: 131,
          userInfo: { nickname: 'a', email: '6dsa@qq.com' }
        },
        {
          from: 'ada',
          mtype: 'normal',
          content: 'https%91%E7%9A%84uart_io.v',
          time: 46546599,
          id: 132,
          userInfo: { nickname: 'a', email: '6dsa@qq.com' }
        }
      ]
    }
    // {
    //   user: 'asg1',
    //   isGroup: 1,
    //   userInfo: { nickname: 'abacd', email: '6dswa@qq.com' },
    //   offline_ids: [],
    //   friend_offline_ids: [],
    //   hidden_ids: [],
    //   message_list: [
    //     {
    //       from: 'ae',
    //       mtype: 'normal',
    //       content:
    //         'https://wzf2000-1.oss-cn-hangzhou.aliyuncs',
    //       time: 46546526,
    //       id: 130,
    //       userInfo: { nickname: 'a', email: '6dsa@qq.com' }
    //     }
    //   ]
    // },
    // {
    //   user: 'a3',
    //   isGroup: 0,
    //   userInfo: { nickname: 'a', email: '6d2sa@qq.com' },
    //   offline_ids: [],
    //   friend_offline_ids: [],
    //   hidden_ids: [],
    //   message_list: [
    //     {
    //       from: 'a3',
    //       mtype: 'normal',
    //       content:
    //         'https://wzf2000-1.oss-cn-hangzhou.aliyuncs.com/' +
    //         'ChatFish/image/1605171666244/%E6%88%91%E7%9A%84uart_io.v',
    //       time: 46546316,
    //       id: 131,
    //       userInfo: { nickname: 'a', email: '6dsa@qq.com' }
    //     }
    //   ]
    // }
  ],
  focusUser: null
}

export default messages
