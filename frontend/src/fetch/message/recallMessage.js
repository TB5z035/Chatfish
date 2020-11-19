import { post } from '../post'
import Cookies from 'js-cookie'

export function postRecallMessage(friendName, isGroup, id) {
  const myName = Cookies.get('username')
  const params = isGroup === 0
    ? {
      username: myName,
      is_group: 0,
      friend_name: friendName,
      id: id
    }
    : {
      username: myName,
      is_group: 1,
      group_name: friendName,
      id: id
    }
  return post('/?action=recall', params)
}
