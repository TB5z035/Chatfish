import { post } from '../post'

export function postModifyInfo(username, password, newInfo) {
  const params = {
    ...newInfo,
    username: username,
    password: password
  }
  return post('/?action=modify_user_info', params)
}
