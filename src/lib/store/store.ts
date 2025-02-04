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
})

export const useStore = create(store)
