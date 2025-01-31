import request from '.'

interface IMultiLang {
  en
  ar
}

interface IMultiTheme {
  dark
  light
}

interface ISpecialNeedsPost {
  name?: IMultiLang
  description?: IMultiLang
  icon?: IMultiTheme
  priority?
  image?: IMultiTheme
}

export const specialneedsApi = {
  get: () => request.get('/specialneeds'),
  create: (specialneedsData: ISpecialNeedsPost) =>
    request.post('/specialneeds', specialneedsData),
  edit: (specialneedsData: ISpecialNeedsPost, specialneedId) =>
    request.put('/specialneeds/' + specialneedId, {...specialneedsData}),
  delete: (specialneedId) => request.delete('/specialneeds/' + specialneedId),
}
