import React, {useEffect, useMemo, useState, createContext} from 'react'
import '../styles/globals.css'
import {DefaultSeo} from 'next-seo'
import SEO from '../../next-seo.json'
import {PaletteMode} from '@mui/material'
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from '@mui/material/styles'
import router from 'next/router'
import {CookiesProvider} from 'react-cookie'
import request from 'lib/api'
import useStore from 'lib/store/store'
import Backdrop from 'components/Backdrop'
import ReactQueryProvider from 'components/ReactQueryProvider'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import _ from 'lodash'

export const ColorModeContext = createContext({toggleColorMode: () => {}})

export const isLoggedIn = (cookies) =>
  !!cookies['token'] && cookies['token'] !== 'null'

export const initializeRequest = (token) => {
  request.setSession({token})
}

export const parseServerSideCookies = (ctx) => {
  return new Promise((resolve, reject) => {
    try {
      let cookies = _.get(ctx, 'req.headers.cookie', null)
      let parsedCookies = {}
      if (cookies) {
        cookies.split(';').forEach((cookie) => {
          const [key, value] = cookie.split('=').map((c) => c.trim())
          parsedCookies[key] = value
        })
        resolve(parsedCookies)
      }
    } catch (e) {
      reject({})
    }
  })
}

export const parseSession = (ctx) => {
  const cookies = _.get(ctx, 'req.headers.cookie', null)
  if (!cookies) return null

  const parsedCookies = Object.fromEntries(
    cookies.split(';').map((cookie) => cookie.split('=').map((c) => c.trim())),
  )
  return parsedCookies['token']
}

export const redirectGuest = async (context, fetchData = null) => {
  const cookies = await parseServerSideCookies(context)
  if (!isLoggedIn(cookies)) {
    return {redirect: {destination: '/', permanent: false}}
  }

  const data = fetchData ? await fetchData() : {}
  return {props: {cookies, ...data}}
}

function MyApp({Component, pageProps}) {
  const {token, user, rehydrateUser} = useStore()
  const [mode, setMode] = useState<PaletteMode>(
    pageProps?.cookies?.mode || 'dark',
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeRequest(pageProps.cookies?.token)
  }, [])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
    }),
    [],
  )

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true)
    const handleRouteChangeComplete = () => setLoading(false)
    const handleRouteChangeError = (err) => {
      console.error(err)
      setLoading(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeError)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      router.replace('/')
      return
    }
    if (user) {
      setLoading(false)
      return
    }

    const getUserInfo = async () => {
      try {
        const userData = await rehydrateUser()
        router.push(userData?.role === 1 ? '/tickets' : '/schedules')
      } catch (error) {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    getUserInfo()
  }, [user, token])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {main: '#3DBEC9'},
          background: {
            default: mode === 'dark' ? '#121212' : '#F7F8FA',
            paper: mode === 'dark' ? '#1E1E1E' : '#FFF',
          },
          text: {
            primary: mode === 'dark' ? '#FFF' : '#2A3256',
            secondary: '#B7BBC8',
          },
          divider: mode === 'dark' ? '#292929' : '#E9E9EB',
        },
        typography: {fontFamily: 'Mulish, sans-serif'},
      }),
    [mode],
  )

  return (
    <>
      <DefaultSeo {...SEO} />
      <ReactQueryProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CookiesProvider>
            <ColorModeContext.Provider value={colorMode}>
              <MUIThemeProvider theme={theme}>
                <Backdrop isVisible={loading} />
                <Component {...pageProps} setLoading={setLoading} />
              </MUIThemeProvider>
            </ColorModeContext.Provider>
          </CookiesProvider>
        </LocalizationProvider>
      </ReactQueryProvider>
    </>
  )
}

export default MyApp
