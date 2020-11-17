const messages = (state = initialState, action) => {
  let newList = [...state]
  let j = 0
  const len = newList.length
  switch (action.type) {
    case 'DELETE_FRIEND':
      for (; j < len; j++) {
        if (newList[j].isGroup === 0 && newList[j].user === action.friendName) {
          newList.splice(j, 1)
          break
        }
      }
      return newList
    case 'DELETE_GROUP':
      for (; j < len; j++) {
        if (newList[j].isGroup === 1 && newList[j].user === action.groupName) {
          newList.splice(j, 1)
          break
        }
      }
      return newList
    case 'ADD_FRIEND':
      return [
        ...state,
        { user: action.friendName, message_list: [], isGroup: 0, userInfo: action.userInfo }
      ]
    case 'ADD_GROUP':
      return [
        ...state,
        { user: action.groupName, message_list: [], isGroup: 1, userInfo: action.userInfo }
      ]
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
      return newList
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
            userInfo: action.userInfo
          })
          newList.unshift(temp)
        }
      }
      return newList
    case 'NEW_MESSAGE_RECEIVE':
      for (; j < len; j++) {
        if (
          (newList[j].isGroup === 1 &&
            action.isGroup === 1 &&
            newList[j].user === action.group) ||
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
          if (!action.isFocus) {
            temp.offline_ids.push(action.id)
          }
          newList.unshift(temp)
        }
      }
      return newList
    case 'SET_FOCUS_USER':
      for (; j < len; j++) {
        if (newList[j].isGroup === action.username.isGroup &&
            newList[j].user === action.username.user) {
          newList[j].offline_ids = []
        }
      }
      return newList
    default:
      return state
  }
}

const initialState = [
  // { user: 'asg',
  //   isGroup: 0,
  //   userInfo: { nickname: 'a', email: '6dsa@qq.com' },
  //   offline_ids: [131],
  //   message_list: [{ from: 'a',
  //     type: 'abnormal',
  //     content: 'https://wzf2000-1.oss-cn-hangzhou.aliyuncs.com/' +
  //         'ChatFish/image/1605171666244/%E6%88%91%E7%9A%84uart_io.v',
  //     time: 46546516,
  //     id: 131,
  //     userInfo: { nickname: 'a', email: '6dsa@qq.com' } }] }
]

export default messages
