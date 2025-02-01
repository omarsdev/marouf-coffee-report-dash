import request from '.'

export const departmentsApi = {
  get: async () => request.get('/departments'),
  create: async (body: any) => request.post('/departments', body),
  getId: async (id: string) => request.get('/departments/' + id),
  edit: async (id: string, body: any) =>
    request.put('/departments/' + id, body),
  delete: async (id: string) => request.delete('/departments/' + id),
}
