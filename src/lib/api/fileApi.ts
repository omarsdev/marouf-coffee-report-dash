import {NONAME} from 'dns'
import request from '.'

export const filesApi = {
  upload: ({file}) => {
    console.log(file)
    let data = new FormData()
    data.append('file', file)
    return request.post('/upload/image-upload?name=darsi', data, {
      // baseURL: "https://hidden-badlands-15671.herokuapp.com/api",
      //@ts-ignore
      headers: {
        // COMPID: undefined,
        // "x-auth-token": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWM5MmRlNmI5OWI3NjAwMTZlNTIyOGUiLCJ0eXBlIjoxLCJjb21wYW55SWQiOiJzYWxhZGJvdXRpcXVlIiwicGhvbmUiOiIrOTYyNzg5Nzg4Nzc4IiwiaWF0IjoxNjQwNTc4NTc4fQ.IxwkQ8fO1B96NbgufuhI-o-6vOTW4Us9uOEyNrN1Ics',
      },
    })
  },
}
