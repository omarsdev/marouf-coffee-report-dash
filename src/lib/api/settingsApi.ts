import request from ".";

export const settingsApi = {
  get: () => request.get('/settings')
}