import Axios, {AxiosResponse, AxiosError, AxiosStatic} from 'axios'
import _ from 'lodash'

//https://lit-plains-02666.herokuapp.com/api/
export const PRODUCTION_API = 'https://darsivuedale.herokuapp.com/api/'
export const STAGING_API =
  'https://maroufticket-9bb3c74b4061.herokuapp.com/api/'
const AUTH_HEADER = 'x-auth-token'
export const GOOGLE_API_KEY = 'AIzaSyD5OQ-RVhYfeYpBiD65zb7PdZkQpfOHWnA'
// export const GOOGLE_API_KEY = 'AIzaSyD5OQ-RVhYfeYpBiD65zb7PdZkQpfOHWnA'

const request = Axios as AxiosStatic & {
  setSession: any
  removeSession: any
  setUser: any
  setEnv: any
  getSession: any
}

const onSuccess = function (response) {
  console.log('Request Successful!', response)
  return _.get(response, 'data', response)
}

const onError = function (error) {
  if (Axios.isCancel(error)) {
    return Promise.reject(error)
  }
  console.log(error)
  if (error.response) {
    // Request was made but server responded with something
    // other than 2xx
    console.log('FAILED Response:', error.response)
    console.log('FAILED Status:', error.response.status)
    console.log('FAILED Data:', error.response.data)
    console.log('FAILED Headers:', error.response.headers)

    switch (error.response.status) {
      case 401:
        // TODO: revoke local session
        break
      case 422:
        const errors = _.get(error, 'response.data.errors', null)
        const message = _.get(
          error,
          'response.data.message',
          'Please check your input',
        )

        if (errors) {
          error.response.data.message = _.get(
            _.values(errors),
            '[0][0]',
            message,
          )
          error.response.data['errors'] = errors
        } else if (message) {
          error.response.data.message = message
        }

      default:
        break
    }
    return Promise.reject(error.response.data)
  } else {
    // Something else happened while setting up the request
    // triggered the error
    console.log('Error Message:', error.message)
  }

  return Promise.reject(error)
}
// request.interceptors.request.use((request) => {
//     console.log("REST", request)
//     return Promise.resolve(request)
// })
request.interceptors.response.use(onSuccess, onError)

request.defaults.headers['accept-language'] = 'en'
request.defaults.headers['x-lang'] = 0
request.defaults.headers['access-control-allow-origin'] = '*'

// request.defaults.baseURL = PRODUCTION_API
request.defaults.baseURL = STAGING_API

// request.defaults.headers[AUTH_HEADER] = window.localStorage.getItem("token");

request['setSession'] = function ({token}) {
  request.defaults.headers[AUTH_HEADER] = token
}

request['getSession'] = function ({token}) {
  return request.defaults.headers[AUTH_HEADER]
}

request['setEnv'] = function () {
  // const env = window.localStorage.getItem("ENV");
  // const URL = !(env !== "production") ? stg : prod;
  // request.defaults.baseURL = URL;
}

request['setUser'] = function ({user}) {
  // window.localStorage.setItem("user", JSON.stringify(user));
}

request['removeSession'] = function () {
  delete this.defaults.headers[AUTH_HEADER]
}

export default request

export const returnServerHeader = (serverToken) => {
  if (!!serverToken) {
    return {
      [AUTH_HEADER]: serverToken,
    }
  } else {
    return {}
  }
}
