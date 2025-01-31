import request from '.'

interface IMultiLang {
  en
  ar
}

interface IBannerPost {
  venue?
  link?
  priority?
  image?: IMultiLang
}

export const bannersApi = {
  get: () => request.get('/banners'),
  create: (bannerData: IBannerPost) => request.post('/banners', bannerData),
  edit: (bannerData: IBannerPost, bannerId) =>
    request.put('/banners/' + bannerId, {...bannerData}),
  delete: (bannerId) => request.delete('/banners/' + bannerId),
}
