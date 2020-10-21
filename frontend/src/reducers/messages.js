const messages = (state = initialState, action) => {
  const newList = [...state]
  let j = 0
  const len = newList.length
  switch (action.type) {
    case 'ADD_FRIEND':
      return [...state, { user: action.friendName, message_list: [] }]
    case 'SET_MESSAGE_LIST':
      return action.messageList
    case 'NEW_MESSAGE_SEND':
      for (; j < len; j++) {
        if (newList[j].user === action.receiver) {
          newList[j].message_list.push({
            from: action.author,
            content: action.message,
            time: new Date().toLocaleTimeString(),
            type: 'normal'
          })
        }
      }
      return newList
    case 'NEW_MESSAGE_RECEIVE':
      for (; j < len; j++) {
        if (newList[j].user === action.author) {
          newList[j].message_list.push({
            from: action.author,
            content: action.message,
            time: new Date().toLocaleTimeString(),
            type: 'normal'
          })
        }
      }
      return newList
    default:
      return state
  }
}

const initialState = [{ user: 'ddd', message_list: [] }]

export default messages
