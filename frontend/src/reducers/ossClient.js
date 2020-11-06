import * as types from '../actions/ActionTypes'

const ossClient = (state = null, action) => {
  switch (action.type) {
    case types.SET_OSS_CLIENT:
      if (action.client !== undefined) { return action.client } else return null
    default:
      return state
  }
}

export default ossClient
