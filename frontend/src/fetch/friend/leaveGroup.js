import { post } from '../post'

export async function postLeaveGroup(username, groupName) {
  let isSend = null
  const params = {
    username: username,
    group_name: groupName
  }

  await post('/?action=leave_group', params).then((res) =>
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
