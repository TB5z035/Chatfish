import { post } from '../post'

export async function postAgreeAddFriend(username, friendName) {
  const params = {
    username: username,
    friend_name: friendName
  }

  return post('/?action=agree_add_friend', params)
}
