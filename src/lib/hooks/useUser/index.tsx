import request from 'lib/api'
import useStore from 'lib/store/store'
import {useCookies} from 'react-cookie'
import router from 'next/router'
import React from 'react'
import cookie from "cookie-cutter"
export default function UserUser() {
  const [_, setCookies] = useCookies()
  const {reset} = useStore()

  const handleSignout = async () => {
    // await router.prefetch('/')
    reset()
    request.removeSession()
    cookie.set('token',"")
    router.push('/')
    //clear STORE
  }

  return {
    logout: handleSignout,
  }
}
