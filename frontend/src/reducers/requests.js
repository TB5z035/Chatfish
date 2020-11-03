const requests = (state = initialState, action) => {
  const newList = [...state]
  let j = 0
  const len = newList.length
  switch (action.type) {
    case 'SET_REQUEST_LIST':
      return action.requests
    case 'ADD_REQUEST':
      newList.push({ isGroup: action.isGroup, user: action.user, friend_name: action.friend_name })
      return newList
    case 'DELETE_REQUEST':
      for (; j < len; j++) {
        if (newList[j]['isGroup'] === action.isGroup && newList[j]['user'] === action.user) {
          newList.splice(j, 1)
          break
        }
      }
      return newList
    default:
      return state
  }
}

const initialState = [
  // { user: 'test', isGroup: 1, friend_name: 'super' },
  // { user: 'Alice', isGroup: 0, friend_name: '2345' },
  // { user: 'Alice', isGroup: 1, friend_name: '2345' }
]

export default requests
