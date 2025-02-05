import request from 'lib/api'
import router from 'next/router'
import React from 'react'
import cookie from "cookie-cutter"
export default function UserUser() {

  const handleSignout = async () => {
    // await router.prefetch('/')
    request.removeSession()
    cookie.set('token',"")
    router.push('/')
    //clear STORE
  }

  return {
    logout: handleSignout,
  }
}
