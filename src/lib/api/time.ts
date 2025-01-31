import request from "."

export const timeApi = {
    get: () => request.get('/otp/time'),
    getSeed: () => request.get('/otp/time_seed')
}