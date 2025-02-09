import {userApi} from 'lib/api/userApi'
import create from 'zustand'
import {getCookie, setCookie} from 'cookies-next'
import {initializeRequest} from 'pages/_app'

interface StoreState {
  user: any | null
  token: string | null
  settings: Record<string, any> | null
  rehydrate: (hydrationObject: Partial<StoreState>) => void
  rehydrateUser: () => Promise<any | null>
  reset: () => void
}

const initNetworkRouter = async (): Promise<void> => {
  try {
    const token = getCookie('token') as string | null
    if (token) {
      await initializeRequest({token})
    }
  } catch (error) {
    console.error('Error initializing network router:', error)
  }
}

const useStore = create<StoreState>((set) => ({
  user: null,
  token: (getCookie('token') as string | null) || null,
  settings: null,

  rehydrate: (hydrationObject: any) => {
    set({...hydrationObject})
    if (hydrationObject.token) {
      setCookie('token', hydrationObject.token, {
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
      console.error('Error rehydrating user:', error)
      return null
    }
  },

  reset: () => set({user: null, token: null, settings: null}),
}))

export default useStore
