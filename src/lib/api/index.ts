import Axios, {AxiosResponse, AxiosError, AxiosStatic} from 'axios'
import useStore from 'lib/store/store'
import _ from 'lodash'
import {Cookies} from 'react-cookie'

export const PRODUCTION_API =
  'https://marouf-ticket-ac294cbae16f.herokuapp.com/'
export const STAGING_API =
  'https://stg-marouf-ticket-c3fae247ad08.herokuapp.com/api/'
const AUTH_HEADER = 'x-auth-token'

// ⚠️ Move the API key to an environment variable for security reasons
// export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || ''
export const GOOGLE_API_KEY = ''

const request = Axios as AxiosStatic & {
  setSession: (params: {token: string}) => void
  removeSession: () => void
  setUser: (params: {user: any}) => void
  setEnv: () => void
  getSession: () => string | undefined
}

/**
 * Handles successful responses.
 */
const onSuccess = (response: AxiosResponse) => _.get(response, 'data', response)

/**
 * Handles errors from API responses.
 */
const onError = (error: AxiosError) => {
  if (Axios.isCancel(error)) {
    return Promise.reject(error)
  }

  if (error.response) {
    console.error('FAILED Response:', error.response)

    const {status, data} = error.response
    const cookies = new Cookies()

    switch (status) {
      case 401:
        // TODO: Handle unauthorized access (e.g., logout user)
        break
      case 411:
        cookies.remove('token')
        request.removeSession()
        useStore.getState().reset()
        break
      case 422:
        const errors = _.get(data, 'errors', null)
        const message = _.get(data, 'message', 'Please check your input')

        if (errors) {
          data.message = _.get(_.values(errors), '[0][0]', message)
          data.errors = errors
        } else {
          data.message = message
        }
        break
      default:
        console.error('Unhandled Error Status:', status)
        break
    }
    return Promise.reject(data)
  } else {
    console.error('Network Error:', error.message)
  }

  return Promise.reject(error)
}

request.interceptors.request.use((config) => {
  const token = useStore.getState().token
  if (token) {
    config.headers['x-auth-token'] = token
  }
  config.headers['Content-Type'] = 'application/json'

  return config
})

request.interceptors.response.use(onSuccess, onError)

// Default Headers
request.defaults.headers.common = {
  'accept-language': 'en',
  'x-lang': '0',
  'access-control-allow-origin': '*',
}

// Default Base URL
request.defaults.baseURL = STAGING_API

/**
 * Sets the authentication token in Axios headers.
 */
request.setSession = ({token}: {token: string}) => {
  request.defaults.headers.common[AUTH_HEADER] = token
}

/**
 * Retrieves the current authentication token.
 */
request.getSession = () => request.defaults.headers.common[AUTH_HEADER]

/**
 * Removes the authentication token from Axios headers.
 */
request.removeSession = () => {
  delete request.defaults.headers.common[AUTH_HEADER]
}

/**
 * Placeholder function for setting the API environment.
 */
request.setEnv = () => {
  // TODO: Implement logic for switching environments dynamically
}

/**
 * Placeholder function for setting user details.
 */
request.setUser = ({user}: {user: any}) => {
  // TODO: Implement user session persistence
}

export default request

/**
 * Returns the authentication header for server requests.
 */
export const returnServerHeader = (serverToken?: string) => {
  return serverToken ? {[AUTH_HEADER]: serverToken} : {}
}
