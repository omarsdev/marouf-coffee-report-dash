import request from 'lib/api'
import useStore from 'lib/store/store'
import router from 'next/router'
import React from 'react'
import {useCookies} from 'react-cookie'

export default function UserUser() {
  const [_, setCookies] = useCookies()
  const {reset} = useStore()

  const handleSignout = async () => {
    // await router.prefetch('/')
    reset()
    request.removeSession()
    setCookies('token', null)
    router.push('/')
    //clear STORE
  }

  return {
    logout: handleSignout,
  }
}
