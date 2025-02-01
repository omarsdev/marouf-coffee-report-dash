import request from '.'

export const ticketsApi = {
  get: async (options) => {
    console.log({options})
    return request.get('/tickets' + options)
  },
  create: async (body: any) => request.post('/tickets', body),
  getId: async (id: string) => request.get('/tickets/' + id),
  edit: async (id: string, body: any) => request.put('/tickets/' + id, body),
  delete: async (id: string) => request.delete('/tickets/' + id),
}
