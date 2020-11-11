import { post } from '../post'

export async function postDisagreeAddFriend(username, friendName) {
  let isSend = null
  const params = {
    username: username,
    friend_name: friendName
  }

  await post('/?action=disagree_add_friend', params).then((res) =>
    res
      .json()
      .catch((error) => console.error('Error:', error))
      .then((data) => {
        if (
          data != null &&
                    Object.prototype.hasOwnProperty.call(data, 'state') &&
                    data['state'] === 200
        ) {
          isSend = true
        }
      })
  )
  return isSend
}
