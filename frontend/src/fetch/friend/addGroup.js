import { post } from '../post'

export function postAddGroup(type, username, friendList, groupName) {
  const params = {
    type: type,
    username: username,
    group_name: groupName,
    friend_list: friendList
  }
  return post('/?action=add_group', params)
}
