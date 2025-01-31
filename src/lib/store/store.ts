import {branchesApi} from 'lib/api/branches'
import {settingsApi} from 'lib/api/settingsApi'
import {userApi} from 'lib/api/userApi'
import create from 'zustand'
import cookiecutter from 'cookie-cutter'
import {initializeRequest} from 'pages/_app'
import {venuesApi} from 'lib/api/venues'
import {categoriesApi} from 'lib/api/categories'
import {bannersApi} from 'lib/api/banners'
import {advertisesApi} from 'lib/api/advertises'
import {specialneedsApi} from 'lib/api/specialneeds'

export const initialState = {
  user: null,
  settings: null,
  venues: null,
  mainCategories: null,
  banners: null,
  advertises: null,
  specialneeds: null,
}

const initNetworkRouter = async () => {
  let company = cookiecutter.get('company')
  let token = cookiecutter.get('token')
  await initializeRequest({company, token})
}

const store = (set, get) => ({
  ...initialState,
  rehydrate: (HydrationObject) => {
    set({
      ...HydrationObject,
    })
  },
  rehydrateUser: () => {
    return new Promise(async (resolve, reject) => {
      initNetworkRouter()
      try {
        let {user} = (await userApi.rehydrate()) as any
        set({
          user: user,
        })
        resolve(user)
      } catch (e) {
        reject(e)
      }
    })
  },
  rehydrateVenues: () => {
    return new Promise(async (resolve, reject) => {
      initNetworkRouter()
      try {
        let {venues} = (await venuesApi.get()) as any
        console.log('VENUS', venues)
        set({
          venues: venues,
        })
        resolve(venues)
      } catch (e) {
        reject(e)
      }
    })
  },
  rehydrateMainCategories: () => {
    return new Promise(async (resolve, reject) => {
      initNetworkRouter()
      try {
        let {categories} = (await categoriesApi.get()) as any
        console.log('categories', categories)
        let _main = categories.filter((c) => {
          return c.is_main_category
        })
        set({
          mainCategories: _main,
        })
        resolve(_main)
      } catch (e) {
        reject(e)
      }
    })
  },
  rehydrateSettings: () => {
    return new Promise(async (resolve, reject) => {
      initNetworkRouter()
      try {
        let {settings} = (await settingsApi.get()) as any
        set({
          settings: settings,
        })
        resolve(settings)
      } catch (e) {
        reject(e)
      }
    })
  },
  rehydrateBanners: () => {
    return new Promise(async (resolve, reject) => {
      initNetworkRouter()
      try {
        let {banners} = (await bannersApi.get()) as any
        set({
          banners: banners,
        })
        resolve(banners)
      } catch (e) {
        reject(e)
      }
    })
  },
  rehydrateAdvertisements: () => {
    return new Promise(async (resolve, reject) => {
      initNetworkRouter()
      try {
        let {advertises} = (await advertisesApi.get({main: true})) as any
        set({
          advertises: advertises,
        })
        resolve(advertises)
      } catch (e) {
        reject(e)
      }
    })
  },
  rehydrateSpecialNeeds: () => {
    return new Promise(async (resolve, reject) => {
      initNetworkRouter()
      try {
        let {specialneeds} = (await specialneedsApi.get()) as any
        set({
          specialneeds: specialneeds,
        })
        resolve(specialneeds)
      } catch (e) {
        reject(e)
      }
    })
  },
})

export const useStore = create(store)
