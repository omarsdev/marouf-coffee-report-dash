import request from '.'

export const userApi = {
  getAllAreaManagers: async () => request.get('/users/area_manager'),
  get: async (options?: string) => request.get('/users' + (options || '')),
  create: async (data: any) => request.post('/users', data),
  getId: async (id: string) => request.get('/users/' + id),
  edit: async (id: string, data: any) => request.put('/users/' + id, data),
  delete: async (id: string) => request.delete('/users/' + id),
  login: (data) => request.post('/auth', data),
  rehydrate: (token?) =>
    request.get(
      '/users/me',
      token
        ? {
            headers: {
              'x-auth-token': token,
            },
          }
        : {},
    ),
  update: (data: any, id) => request.put('/users/' + id, data),
}
