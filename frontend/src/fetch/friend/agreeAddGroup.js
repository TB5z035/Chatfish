import { post } from '../post'

export async function postAgreeAddGroup(username, groupName, friendName) {
  const params = {
    username: username,
    group_name: groupName,
    friend_name: friendName
  }

  return post('/?action=agree_add_group', params)
}
