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
        { user: action.friendName, message_list: [], isGroup: 0 }
      ]
    case 'ADD_GROUP':
      return [
        ...state,
        { user: action.groupName, message_list: [], isGroup: 1 }
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
            userInfo: action.userInfo
          })
          newList.unshift(temp)
        }
      }
      return newList
    default:
      return state
  }
}

const initialState = [
]

export default messages
