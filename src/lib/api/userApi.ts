import request from '.'

export const userApi = {
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
