import React, {FunctionComponent, ReactNode, useEffect} from 'react'
import {NextSeo} from 'next-seo'
import Header from './Header'
import SideBar from './Sidebar'
import {Box, Container} from '@mui/material'
import moment from 'moment'
import clsx from 'clsx'
import useStore from 'lib/store/store'

type LayoutProps = {
  meta?: any
  children: ReactNode // Add this line to include children
}

const DefaultLayout: FunctionComponent<LayoutProps> = ({
  children,
  meta,
  cookies,
}: any) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
  } = meta || {}
  const {user} = useStore()
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? undefined : '%s'}
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [ogImage] : undefined,
        }}
        canonical={url}
      />
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          overflow: 'hidden',
        }}
        className="h-screen flex w-screen"
      >
        <Box
          sx={{display: {xs: user?.role === 1 ? 'none' : 'block', md: 'block'}}}
        >
          <SideBar />
        </Box>
        <div className="w-full h-full">
          <Header />
          <Box
            sx={{
              marginLeft: {xs: user?.role === 1 ? '0' : '7rem', md: '7rem'},
              height: '100%',
            }}
            className={clsx(
              'pt-20',
              'sm:pt-18',
              'md:pt-20',
              'lg:pt-14',
              // 'px-0 sm:px-6',
            )}
          >
            {false && (
              <div className="text-white w-full bg-yellow-500 text-center font-medium py-1">
                Your subscription is almost over, remember to renew it before{' '}
                {moment().format('LLL')}
              </div>
            )}
            <div className="relative w-full overflow-y-auto h-full">
              <Container
                className="h-full prose pt-14 dark:prose-dark md:dark:prose-xl-dark md:prose-xl max-w-screen-xl p-0 w-full mx-auto"
                style={{paddingInline: '1rem'}}
              >
                {children}
              </Container>
            </div>
          </Box>
        </div>
      </Box>
    </>
  )
}

//<div className="prose dark:prose-dark md:dark:prose-xl-dark md:prose-xl max-w-screen-xl mt-0 mx-auto leading-6">
export default DefaultLayout
