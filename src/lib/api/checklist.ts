import request from '.'

export const checklistApi = {
  get: async (option?: string) =>
    request.get('/reports/allreports' + (option ?? '')),
  create: async (data: any) => request.post('/reports', data),
  getId: async (id: string) => request.get('/reports/' + id),
  update: async (id: string, data: any) => request.put('/reports/' + id, data),
  delete: async (id: string) => request.delete('/reports/' + id),
}
