import request from '.'

export const schedulesApi = {
  create: async (body: any) => request.post('/assignments', body),
  get: async () => request.get('/assignments'),
  getId: async (id: string) => request.get('/assignments/' + id),
  update: async (id: string, body: any) =>
    request.put('/assignments/' + id, body),
  delete: async (id: string) => request.delete('/assignments/' + id),
}
