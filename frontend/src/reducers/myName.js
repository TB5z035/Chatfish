import * as types from '../actions/ActionTypes'

const myName = (state = initialName, action) => {
  switch (action.type) {
    case types.SET_MY_NAME:
      return action.myName
    default:
      return state
  }
}

const initialName = {
  username: "TB5",
  nickname: "TB5tclaaaaaaaaaaaaaaaaaaaaaaaaasssssssssssssssssssssssssssssssssssssssssssssssssssssaaaaaaaaaaaaaaaasssssssssssssssssssssssssssssssssssssssssssssssssssssaaaaaaaaaaaaaaaasssssssssssssssssssssssssssssssssssssssssssssssssssssaaaaaaaaaaaaaaaassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
  email: "654154090@qq.com"
}

export default myName
