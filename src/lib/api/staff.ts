import request from '.'
import {ILanguageObject, ILocationObject} from './types'

type Gender = 'male' | 'female' | 'none'

interface MultiLang {
  en: String
  ar: String
}

interface IStaffLink {
  title: MultiLang
  description: MultiLang
  priority: number
  user: string
  price_added
  calendar_color
  venues: Array<string>
  booking_days_limit
  working_days
}

export const staffApi = {
  get: (venueId) => request.get('/venues/entities/sort/' + venueId),
  getById: (staffId) => request.get('/entities/by/' + staffId),
  link: (staffData: IStaffLink) => request.post('/entities', staffData),
  edit: (staffData, staffId) =>
    request.put('/entities/' + staffId, {...staffData}),
  delete: (staffId) => request.delete('/entities/' + staffId),
  addAndLink: (body) => request.post('/users/staff_admin', body),
  resetPassword: (id) => request.put(`/entities/update-pass/${id}`),
  search: (query) => request.get(`entities/search_by?${query}`),
  specialneedsStaff: () => request.get('entities/special_needs'),
  verifyStaff: (id: string, verified: boolean) =>
    request.patch(`entities/${id}/verify`, {
      verified,
    }),
}
