import {userApi} from 'lib/api/user'
import create from 'zustand'
import {Cookies} from 'react-cookie'
import {initializeRequest} from 'pages/_app'

interface StoreState {
  user: any | null
  token: string | null
  settings: Record<string, any> | null
  rehydrate: (hydrationObject: Partial<StoreState>) => void
  rehydrateUser: () => Promise<any | null>
  reset: () => void
  setToken: (token: string) => void
}

const initNetworkRouter = async (): Promise<void> => {
  try {
    const token = new Cookies().get('token') as string | null
    if (token) {
      await initializeRequest({token})
    }
  } catch (error) {
    console.error('Error initializing network router:', error)
  }
}

const useStore = create<StoreState>((set) => ({
  user: null,
  token: (new Cookies().get('token') as string | null) || null,
  settings: null,

  rehydrate: (hydrationObject: any) => {
    set({...hydrationObject})
    if (hydrationObject.token) {
      new Cookies().set('token', hydrationObject.token, {
        maxAge: 7 * 24 * 60 * 60, // Expires in 7 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    }
  },

  rehydrateUser: async () => {
    await initNetworkRouter()
    try {
      const data = (await userApi.rehydrate()) as any
      set({user: data})
      return data
    } catch (error) {
      set({user: null, token: null})
      console.error('Error rehydrating user:', error)
      return null
    }
  },

  reset: () => set({user: null, token: null, settings: null}),
  setToken: (token: string) => set({token}),
}))

export default useStore
