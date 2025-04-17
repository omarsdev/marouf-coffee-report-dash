import request from '.'

export const sendNotificationsApi = {
  create: async (body: any) => request.post('/notifications ', body),
}
