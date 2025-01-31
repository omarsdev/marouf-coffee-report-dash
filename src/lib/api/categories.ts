import request from '.'
import {ILanguageObject, ILocationObject} from './types'

type Gender = 'male' | 'female' | 'none'

interface MultiLang {
  en: String
  ar: String
}

interface IVenuePost {
  name: MultiLang
  description: MultiLang
  image: MultiLang
  priority
}

export const categoriesApi = {
  get: () => request.get('/categories?main=true'),
  create: (categoryData: IVenuePost) =>
    request.post('/categories?main=true', categoryData),
  edit: (categoryData, catID) =>
    request.put('/categories/' + catID, {...categoryData}),
  delete: (catID) => request.delete('/categories/' + catID),
}
