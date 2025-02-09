import request from '.'

export const schedulesApi = {
  create: async (body: any) => request.post('/assignments', body),
  get: async (option?: string) => request.get('/assignments' + option),
  getId: async (id: string) => request.get('/assignments/' + id),
  update: async (id: string, body: any) =>
    request.put('/assignments/' + id, body),
  delete: async (id: string) => request.delete('/assignments/' + id),
}
