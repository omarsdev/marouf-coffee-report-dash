import request from '.'

export const branchApi = {
  create: async (body: any) => request.post('/branches', body),
  get: async (option?: string) => request.get('/branches' + (option ?? '')),
  getId: async (id: string) => request.put('/branches/' + id),
  update: async (id: string, body: any) => request.put('/branches/' + id, body),
  delete: async (id: string) => request.delete('/branches/' + id),
}
