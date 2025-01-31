import request from '.'

export const studentsApi = {
  get: () => request.get('/users/students'),
}
