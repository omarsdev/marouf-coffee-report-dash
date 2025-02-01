import request from '.'

export const questionsApi = {
  get: async () => request.get('/questions'),
  create: async (data: any) => request.post('/questions', data),
  getId: async (id: string) => request.get('/questions/' + id),
  update: async (id: string, data: any) =>
    request.put('/questions/' + id, data),
  delete: async (id: string) => request.delete('/questions/' + id),
}
