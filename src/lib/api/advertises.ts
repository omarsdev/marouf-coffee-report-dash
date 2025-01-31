import request from '.'

interface IMultiLang {
  en
  ar
}

interface IAdvertisementPost {
  venue?
  link?
  priority?
  image?: IMultiLang
}

export const advertisesApi = {
  get: (filters) => request.get('advertises', {params: {...filters}}),
  create: (advertisementData: IAdvertisementPost) =>
    request.post('/advertises', {...advertisementData}),
  edit: (advertisementData: IAdvertisementPost, advertisementId) =>
    request.put('/advertises/' + advertisementId, {...advertisementData}),
  delete: (advertisementId) => request.delete('/advertises/' + advertisementId),
}
