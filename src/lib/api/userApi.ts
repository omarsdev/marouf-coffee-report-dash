import request from '.'
import {timeApi} from './time'

export const userApi = {
  sendOTP: (phone) => {
    return new Promise(async (resolve, reject) => {
      //     resolve(null)
      //     try {
      //         let { minute } = await timeApi.getSeed() as any;
      //         let seed = minute + "NOTHINGISFOREVER21" + minute
      //         console.log("TIMESEED", seed, "Min", minute)
      //         let hash = await sha1(seed).then(hash => {
      //             return hash
      //             console.log('HASH', hash);
      //         }).catch(e => {
      //             throw e;
      //         })
      //         await request.post('/otp/otp', {
      //             phone,
      //             hash
      //         })
      //         resolve(null)
      //     } catch (e) {
      //         console.error(e)
      //         reject(e)
      //     }
      resolve(0)
    })
  },
  verifyOTP: (phone, code) => {
    return request.post('/otp/verify', {phone, code})
  },
  // verifyOTP: (phone, code) => { return new Promise((resolve) => resolve(null)) },
  update: (data: any, id) => request.put('/users/' + id, data),
  signup: (data: any) => request.post('/users', data),
  login: (data) => request.post('/auth', data),
  rehydrate: (token) =>
    request.get(
      '/users/me',
      token
        ? {
            headers: {
              'x-auth-token': token,
            },
          }
        : {},
    ),
  changePassword: ({old_password, new_password}) =>
    request.post('/users/change_password', {old_password, new_password}),
  deleteAccount: ({password}) =>
    request.post('/users/delete-my-account', {password}),
  renew: ({password, phone}) => request.post('/auth/renew', {phone, password}),
  renewPassowrd: ({new_password, phone, code}) =>
    request.post('/otp/forgot_password', {
      new_password,
      phone,
      code,
    }),
}

// https://hidden-badlands-15671.herokuapp.com/api
