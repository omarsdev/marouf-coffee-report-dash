import request from '.'

export const assignmentsApi = {
  get: async (option?: string) => request.get('/assignments' + option),
}
