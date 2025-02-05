import React, {useEffect} from 'react'
import '../styles/globals.css'
import {DefaultSeo} from 'next-seo'
import SEO from '../../next-seo.json'
import {PaletteMode} from '@mui/material'
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from '@mui/material/styles'
import router from 'next/router'
import Backdrop from 'components/Backdrop'
import {CookiesProvider} from 'react-cookie'
import _ from 'lodash'
import request from 'lib/api'
import useStore from 'lib/store/store'
import ReactQueryProvider from 'components/ReactQueryProvider'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'

export const ColorModeContext = React.createContext({toggleColorMode: () => {}})

export const isLoggedIn = (cookies) =>
  !!cookies['token'] && cookies['token'] !== 'null'

export const initializeRequest = (cookies) => {
  request.setSession({token: cookies['token']})
}

export const parseServerSideCookies = (ctx) => {
  return new Promise((resolve, reject) => {
    try {
      let cookies = _.get(ctx, 'req.headers.cookie', null)
      let parsedCookies = {}
      if (!!cookies) {
        cookies = cookies.split(';')
        cookies.map((cookie) => {
          parsedCookies = {
            ...parsedCookies,
            [cookie.split('=')[0].trim()]: cookie.split('=')[1].trim(),
          }
        })
        resolve(parsedCookies)
      }
    } catch (e) {
      reject({})
    }
  })
}

export const parseSession = (ctx) => {
  let cookies = _.get(ctx, 'req.headers.cookie', null)
  let parsedCookies = {}
  if (!!cookies) {
    cookies = cookies.split(';')
    cookies.map((cookie) => {
      parsedCookies = {
        ...parsedCookies,
        [cookie.split('=')[0].trim()]: cookie.split('=')[1].trim(),
      }
    })
  }
  return parsedCookies['token']
}

export const redirectGuest = async (context, SSF = null) => {
  const cookies = await parseServerSideCookies(context)
  if (!cookies['token'] || cookies['token'] == 'null') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } else {
    let SSD = {}
    if (SSF) {
      SSD = await SSF()
    }
    return {
      props: {
        cookies,
      },
    }
  }
}

function MyApp({Component, pageProps, _props}: any) {
  const {token, user, rehydrateUser} = useStore()
  console.log('TOKEN: ', {token, user})

  useEffect(() => {
    initalize()
  }, [])

  const [mode, setMode] = React.useState<PaletteMode>(
    pageProps?.cookies?.mode || 'dark',
  )
  const [loading, setLoading] = React.useState(true)
  // const [_cookies, _] = React.useState(cookies)
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  useEffect(() => {
    const handleRouteChangeComplete = (url, {shallow}): any => {
      setLoading(false)
    }
    const handleRouteChangeStart = (url, {shallow}): any => {
      setLoading(true)
    }
    const handleRouteChangeError = (err, url) => {
      console.error(err)
      setLoading(false)
    }

    router.events.on('routeChangeError', handleRouteChangeError)
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeError', handleRouteChangeError)
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

  const initalize = async () => {
    initializeRequest({
      token: pageProps.cookies?.token,
    })
    // if (!!SSR_DATA) {
    //   rehydrate(SSR_DATA)
    // }
  }

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#3DBEC9',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#F7F8FA',
            paper: mode === 'dark' ? '#1E1E1E' : '#FFF',
          },
          text: {
            primary: mode === 'dark' ? '#FFF' : '#2A3256',
            secondary: mode === 'dark' ? '#B7BBC8' : '#B7BBC8',
          },
          divider: mode === 'dark' ? '#292929' : '#E9E9EB',
        },
        typography: {
          fontFamily: 'Mulish, sans-serif',
        },
        transitions: {},
      }),
    [mode],
  )

  useEffect(() => {
    if (user) {
      return
    }
    if (token) {
      const getUserInfo = async () => {
        const user = await rehydrateUser()
        setLoading(false)
        router.push(user?.role === 1 ? '/tickets' : '/schedules')
      }
      getUserInfo()
    } else {
      setLoading(false)
    }
  }, [user])

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
                {/* <FormWidget /> */}
              </MUIThemeProvider>
            </ColorModeContext.Provider>
          </CookiesProvider>
        </LocalizationProvider>
      </ReactQueryProvider>
    </>
  )
}

export default MyApp

// MyApp.getInitialProps = async ({ ctx }) => {
//   // const isShallow = !ctx.req || (ctx.req.url && ctx.req.url.startsWith('/_next/data'));
//   // const serverCookies = new Cookies(ctx.req, ctx.res)
//   const parsedCookies = await parseServerSideCookies(ctx)
//   // let SSR_DATA = null;
//   // try {
//   //   if (isLoggedIn(parsedCookies)) {
//   //     initializeRequest(parsedCookies)
//   //     if (!isShallow) {
//   //       let { user } = await userApi.rehydrate() as any
//   //       let { settings } = await settingsApi.get() as any;
//   //       SSR_DATA = { user, settings: settings[0] }
//   //     }
//   //   }
//   // } catch (e) {
//   //   console.error(e);
//   // }

//   return {
//     // SSR_DATA,
//     cookies: parsedCookies
//   }
// }
