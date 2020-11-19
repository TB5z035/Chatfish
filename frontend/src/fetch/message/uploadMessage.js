import { post } from '../post'

export function postUploadMessage(params) {
  return post('/?action=message_upload', params)
}
