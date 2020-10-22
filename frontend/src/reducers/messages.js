const messages = (state = initialState, action) => {
  let newList = [...state]
  let j = 0
  const len = newList.length
  switch (action.type) {
    case 'ADD_FRIEND':
      return [...state, { user: action.friendName, message_list: [] }]
    case 'SET_MESSAGE_LIST':
      newList = action.messageList
      newList.sort((a, b) => {
        if (a.message_list.length === 0) {
          if (b.message_list.length === 0) { return 0 } else return 1
        } else if (b.message_list.length === 0) {
          return -1
        } else {
          return Date.parse(a.message_list.slice(-1)[0].time) -
              Date.parse(b.message_list.slice(-1)[0].time)
        }
      })
      return newList
    case 'NEW_MESSAGE_SEND':
      for (; j < len; j++) {
        if (newList[j].user === action.receiver) {
          const temp = newList[j]
          newList.splice(j, 1)
          temp.message_list.push({
            from: action.author,
            content: action.message,
            time: new Date().getTime(),
            type: 'normal'
          })
          newList.unshift(temp)
        }
      }
      return newList
    case 'NEW_MESSAGE_RECEIVE':
      for (; j < len; j++) {
        if (newList[j].user === action.author) {
          const temp = newList[j]
          newList.splice(j, 1)
          temp.message_list.push({
            from: action.author,
            content: action.message,
            time: new Date().getTime(),
            type: 'normal'
          })
          newList.unshift(temp)
        }
      }
      return newList
    default:
      return state
  }
}

const initialState = []

export default messages
