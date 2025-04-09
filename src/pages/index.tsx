import React, {useState} from 'react'
import Head from 'next/head'
import DarkModeToggle from '../components/dark-mode-toggle'
import {Button, Checkbox, useTheme} from '@mui/material'
import CustomContainer from 'components/CustomContainer'
import TextInput from 'components/TextInput'
import CustomLabel from 'components/CustomLabel'
import useForm from 'lib/hooks/useForm'
import {userApi} from 'lib/api/user'
import request from 'lib/api'
import router from 'next/router'
import Error from 'components/Error'
import {useCookies, Cookies} from 'react-cookie'
import useStore from 'lib/store/store'
import clsx from 'clsx'

export default function Entry() {
  const theme = useTheme()
  const {rehydrate} = useStore()

  const [rememberMe, setRememberMe] = useState(false)

  const [_, setCookies] = useCookies()
  const handleLogin = async () => {
    clearErrors()
    setBackendError('')
    try {
      await request.removeSession()
      let {token} = (await userApi.login({
        email: values.email_a.toLowerCase().trim(),
        password: values.password_2,
      })) as any
      const data = (await userApi.rehydrate(token)) as any
      if (data?.role === 0 || data?.role === 1) {
        rehydrate({token, user: data})
        if (rememberMe) {
          setCookies('token', token, {
            path: '/',
            secure: true,
            maxAge: 7 * 24 * 60 * 60,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: 'strict',
            httpOnly: false,
          })
        } else {
          setCookies('token', token, {
            path: '/',
            secure: true,
            sameSite: 'strict',
            httpOnly: false,
          })
        }

        request.setSession({token})
        router.push('/schedules')
      } else {
        setBackendError('You are not authorized to access this page')
      }
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    }
  }

  const [backendError, setBackendError] = React.useState<string>('')
  const {handleSubmit, handleChange, errors, values, clearErrors} = useForm({
    initial: {
      email_a: '',
      password_2: '',
    },
    validationSchema: null,
    onSubmit: handleLogin,
  })

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <CustomContainer
        type="primary"
        className="h-screen unselectable w-screen flex justify-center items-center "
      >
        <div
          style={{paddingRight: '1rem'}}
          className="w-full absolute top-0 py-4 flex justify-end"
        >
          <DarkModeToggle />
        </div>
        <CustomContainer
          radius="medium"
          type="secondary"
          className="h-[70%] w-![70%]  md:h-1/2 flex overflow-hidden login_box flex-col-reverse  md:flex-row"
        >
          <div
            key={'wow'}
            className={clsx(
              'w-full  p-12 flex flex-col justify-center',
              ' sm:p-8',
              'lg:w-[75%] lg:p-12',
            )}
          >
            <div className="text-2xl mb-4">Login</div>
            <TextInput
              padding={2}
              name="email_a"
              value={values.email_a}
              onChange={handleChange}
              label="Email Address"
            />
            <TextInput
              name="password_2"
              onChange={handleChange}
              value={values.password_2}
              label="Password"
              secureEntry={true}
              placeholder="********"
            />
            <Error backendError={backendError} />

            <div className="flex-row justify-between flex items-center">
              <div className="flex items-center">
                <Checkbox
                  sx={{color: 'text.primary', p: 0, m: 0, pr: 1}}
                  value={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <div>Remember Me?</div>
              </div>
            </div>
            <div className="flex-row justify-between flex">
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{mt: 3}}
                size="large"
                className="w-40"
              >
                Login
              </Button>
            </div>
          </div>
          <div
            className={clsx(
              'w-full md:1/2 h-full relative flex flex-col justify-center items-center',
              'sm:w-full sm:h-auto sm:mb-4 sm:py-8', // Adjustments for smaller screens
            )}
          >
            <CustomLabel className="z-50 text-center">
              <div className="text-primary-500 z-50 text-xl mb-1">Visit us</div>
              <div
                className={`text-${theme.palette.text.primary} z-50 text-2xl`}
              >
                Powered By Vuedale
              </div>
            </CustomLabel>
          </div>
        </CustomContainer>
      </CustomContainer>
    </>
  )
}
