import { post } from '../post'

export function postAddFriend(username, friendName) {
  const params = {
    username: username,
    friend_name: friendName
  }
  return post('/?action=add_friend', params)
}
