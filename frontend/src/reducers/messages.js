const messages = (state = initialState, action) => {
  const newList = [...state]
  let j = 0
  const len = newList.length
  switch (action.type) {
    case 'SET_MESSAGE_LIST':
      return action.messageList
    case 'NEW_MESSAGE_SEND':
      for (; j < len; j++) {
        if (newList[j].user === action.receiver) {
          newList[j].message_list.push({
            from: '_self',
            content: action.message,
            time: new Date(),
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
            time: new Date(),
            type: 'normal'
          })
        }
      }
      return newList
    default:
      return state
  }
}

const initialState = [
  {
    user: 'TB5',
    message_list: [
      { type: 'normal', content: 'Hi!', time: new Date(), from: 'TB5' },
      { type: 'normal', content: 'H2!', time: new Date(), from: '_self' },
      { type: 'normal', content: 'H3!', time: new Date(), from: 'TB5' },
      { type: 'normal', content: 'H4!', time: new Date(), from: 'TB5' },
      { type: 'normal', content: 'H5!', time: new Date(), from: '_self' }
    ]
  },
  { user: 'TB6', message_list: [] },
  { user: 'TB7', message_list: [] },
  { user: 'TB8', message_list: [] },
  { user: 'TB9', message_list: [] }
]

export default messages
