import {NONAME} from 'dns'
import request from '.'

export const filesApi = {
  upload: ({file}) => {
    let data = new FormData()
    data.append('file', file)
    return request.post('/upload/image-upload?name=darsi', data, {
      headers: {},
    })
  },
}
