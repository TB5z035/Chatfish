const messages = (state = [], action) => {
  switch (action.type) {
    case 'NEW_MESSAGE_SEND':
    case 'NEW_MESSAGE_RECEIVE':
      return state.concat([
        {
          message: action.message,
          author: action.author,
          id: action.id
        }
      ])
    default:
      return state
  }
}

export default messages
