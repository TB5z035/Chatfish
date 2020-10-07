const messages = (state = [], action) => {
  switch (action.type) {
    case 'NEW_MESSAGE_UPDATE':
    case 'NEW_MESSAGE_BROADCAST':
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
