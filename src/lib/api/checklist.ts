import request from '.'

export const checklistApi = {
  get: async () => request.get('/reports/allreports'),
  create: async (data: any) => request.post('/reports', data),
  getId: async (id: string) => request.get('/reports/' + id),
  update: async (id: string, data: any) => request.put('/reports/' + id, data),
  delete: async (id: string) => request.delete('/reports/' + id),
}
