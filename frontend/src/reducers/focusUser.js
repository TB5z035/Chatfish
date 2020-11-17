import { postEnterChat } from '../fetch/message/enterChat'

const focusUser = (state = null, action) => {
  switch (action.type) {
    case 'DELETE_FRIEND':
    case 'DELETE_GROUP':
      return null
    case 'SET_FOCUS_USER':
      return action.username
    case 'NEW_MESSAGE_RECEIVE':
      if (state.isGroup === 1 &&
          action.isGroup === 1 &&
          state.user === action.group) {
        postEnterChat(action.group, 1, action.id).then()
      }
      if (state.isGroup === 0 &&
          action.isGroup === 0 &&
          state.user === action.author) {
        postEnterChat(action.author, 0, action.id).then()
      }
      return state
    default:

      return state
  }
}

export default focusUser
