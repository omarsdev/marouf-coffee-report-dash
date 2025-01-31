import request from '.'

export const notificationApi = {
  send: (body) => request.post('/notifications', {...body}),
  sendcrm: (body) => request.post('/notifications/crm', {...body}),
}
