import { post } from '../post'

export function requireFriendList(username) {
  const params = {
    username: username
  }
  return post('/?action=require_friend_list', params)
}
