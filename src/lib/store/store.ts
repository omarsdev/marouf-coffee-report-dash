import {userApi} from 'lib/api/userApi'
import create from 'zustand'
import {getCookie, setCookie} from 'cookies-next'
import {initializeRequest} from 'pages/_app'

// Initialize API Request with Token from Cookies
const initNetworkRouter = async () => {
  try {
    const token = getCookie('token') // Retrieve token from cookies
    if (token) {
      await initializeRequest({token})
    }
  } catch (error) {
    console.error('Error initializing network router:', error)
  }
}

// Zustand Store
const useStore = create((set, get) => ({
  user: null,
  token: getCookie('token') || null, // Persist token from cookies
  settings: null,

  // Rehydrate store from saved state
  rehydrate: (HydrationObject) => {
    set({...HydrationObject})

    // Store token in cookies for persistence
    if (HydrationObject.token) {
      setCookie('token', HydrationObject.token, {
        maxAge: 7 * 24 * 60 * 60, // Expires in 7 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      })
    }
  },

  // Fetch and set user data
  rehydrateUser: async () => {
    await initNetworkRouter() // Ensure API requests are properly initialized
    try {
      const data = (await userApi.rehydrate()) as any

      set({user: data})

      return data
    } catch (error) {
      console.error('Error rehydrating user:', error)
      throw error
    }
  },

  reset: () => {
    set({
      user: null,
      token: null,
      settings: null,
    })
  },
}))

export default useStore
