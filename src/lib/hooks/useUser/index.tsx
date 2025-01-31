import request from 'lib/api'
import router from 'next/router'
import React from 'react'
import {useCookies} from 'react-cookie'

export default function UserUser() {
  const [_, setCookies] = useCookies()

  const handleSignout = async () => {
    // await router.prefetch('/')
    request.removeCompany()
    request.removeSession()
    setCookies('token', null)
    router.push('/')
    //clear STORE
  }

  return {
    logout: handleSignout,
  }
}
