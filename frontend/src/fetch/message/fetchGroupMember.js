import { post } from '../post'

export function fetchGroupMember(groupName, username) {
  const params = {
    group_name: groupName,
    username: username
  }
  return post('/?action=fetch_group_member', params)
}
