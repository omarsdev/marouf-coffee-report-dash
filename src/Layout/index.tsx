import React, {FunctionComponent, ReactNode} from 'react'
import {NextSeo} from 'next-seo'
import Header from './Header'
import SideBar from './Sidebar'
import {Box, Container} from '@mui/material'
import moment from 'moment'

type LayoutProps = {
  meta: any
  children: ReactNode; // Add this line to include children

}

const DefaultLayout: FunctionComponent<LayoutProps> = ({
  children,
  meta,
}: any) => {
  const {title, description, titleAppendSiteName = false, url, ogImage} =
    meta || {}
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
        <SideBar />
        <div className="w-full h-full">
          <Header />
          <div
            style={{
              marginLeft: '7rem',
              height: '100%',
            }}
            className="pt-14"
          >
            {false && (
              <div className="text-white w-full bg-yellow-500 text-center font-medium py-1">
                Your subscription is almost over, remember to renew it before{' '}
                {moment().format('LLL')}
              </div>
            )}
            <div className="relative w-full overflow-y-auto h-full">
              <Container className="h-full prose pt-14 dark:prose-dark md:dark:prose-xl-dark md:prose-xl max-w-screen-xl p-0 w-full mx-auto">
                {children}
              </Container>
            </div>
          </div>
        </div>
      </Box>
    </>
  )
}

//<div className="prose dark:prose-dark md:dark:prose-xl-dark md:prose-xl max-w-screen-xl mt-0 mx-auto leading-6">
export default DefaultLayout
