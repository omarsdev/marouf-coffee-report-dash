import create from 'zustand'
import {userApi} from 'lib/api/userApi'
import cookiecutter from 'cookie-cutter'
import {initializeRequest} from 'pages/_app'

export const initialState = {
  user: null,
}

const initNetworkRouter = async () => {
  let token = cookiecutter.get('token')
  await initializeRequest({token})
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
