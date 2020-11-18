import { post } from '../post'

export function modifyInfo(password, newInfo) {
  const params = {
    ...newInfo,
    password: password
  }
  return post('/?action=modify_user_info', params)
}
