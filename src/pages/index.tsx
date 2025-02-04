import React from 'react'
import Head from 'next/head'
import DarkModeToggle from '../components/dark-mode-toggle'
import {Button, Checkbox, useTheme} from '@mui/material'
import CustomContainer from 'components/CustomContainer'
import TextInput from 'components/TextInput'
import Image from 'next/image'
import CustomLabel from 'components/CustomLabel'
import useForm from 'lib/hooks/useForm'
import {userApi} from 'lib/api/userApi'
import request from 'lib/api'
import {useCookies} from 'react-cookie'
import router from 'next/router'
import Error from 'components/Error'

export default function Entry() {
  const theme = useTheme()

  const [_, setCookies] = useCookies([])
  const handleLogin = async () => {
    clearErrors()
    setBackendError('')
    try {
      await request.removeSession()
      let {token} = (await userApi.login({
        email: values.email_a.toLowerCase(),
        password: values.password_2,
      })) as any
      const data = (await userApi.rehydrate(token)) as any
      if (data?.role !== 0) {
        setBackendError('You are not authorized to access this page')
      } else {
        setCookies('token', token)
        request.setSession(token)
        router.push('/employees')
        console.log('token', token)
      }
    } catch (e) {
      console.log(e)
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
        className="h-screen unselectable w-screen flex justify-center items-center"
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
          className="h-1/2 flex overflow-hidden login_box"
        >
          <div key={'wow'} className="w-1/2 p-12 flex flex-col justify-center">
            <div className="text-2xl mb-4">Login</div>
            <TextInput
              padding={2}
              name="email_a"
              value={values.email_a}
              onChange={handleChange}
              label="Email Address"
              // placeholder="DaNailJoint@DarsiApp.com"
            />
            <TextInput
              name="password_2"
              // padding={2}
              onChange={handleChange}
              value={values.password_2}
              label="password"
              secureEntry={true}
              placeholder="********"
            />
            <Error backendError={backendError} />

            <div className="flex-row  justify-between flex items-center">
              <div className="flex items-center">
                <Checkbox
                  sx={{color: 'text.primary', p: 0, m: 0, pr: 1}}
                  checked={false}
                />
                <div>Remember Me?</div>
              </div>

              {/* <Button
                                sx={{ color: 'text.primary' }}
                                className=""
                            >
                                Forgot your password?
                            </Button> */}
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
          <div className="w-1/2 h-full relative flex flex-col justify-center items-center">
            {/* <Image
            alt=''
              layout="fill"
              priority={true}
              quality="100"
              objectFit="cover"
              src={
                theme.palette.mode == 'dark'
                  ? require('../assets/artclipdark.png')
                  : require('../assets/artclip.png')
              }
            /> */}
            <CustomLabel className="z-50 text-center">
              <div className="text-primary-500 z-50 text-xl mb-1">Visit us</div>
              <div className="text-white z-50 text-2xl">Powered By Vuedale</div>
            </CustomLabel>
          </div>
        </CustomContainer>
      </CustomContainer>
    </>
  )
}

// export async function getServerSideProps(ctx) {
//     console.log("HELLO")
//     const parsedCookies = await parseServerSideCookies(ctx)
//     if (!!parsedCookies['token'] && parsedCookies['token'] !== 'null') {
//         return {
//             redirect: {
//                 destination: '/dashboard',
//                 permanent: false,
//             }
//         }
//     } else {
//         return {
//             props: {
//                 cookies: parsedCookies
//             }
//         }
//     }
// }
