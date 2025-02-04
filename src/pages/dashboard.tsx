import React from 'react'
import Head from 'next/head'
import Layout from '../Layout'
import CustomLabel from 'components/CustomLabel'
import {redirectGuest} from './_app'
import {useStore} from 'lib/store/store'
export default function Dashboard() {
  return (
    <Layout meta={{}}>
      <div className="dark:bg-gray-800 h-full w-full flex justify-center items-center">
        <Head>
          <title>Dashboard</title>
        </Head>
        <div>
          <CustomLabel size="bigTitle">Coming Soon</CustomLabel>
          <CustomLabel size="caption">Activated when app is live</CustomLabel>
        </div>

        {/* <CustomLabel
          type='secondary'
          padding={3} size='normal'>
          Add or remove categories from your application
        </CustomLabel> */}

        {/* <CustomContainer
          radius='medium'
          type='secondary' padding={3}>


          <TextInput
            label='Category Name'
            placeholder='Something New'
            className="w-full"
            padding={1}
          />
          <TextInput
            label='Category Name'
            placeholder='Something New'
            className="w-full"
            padding={1}
          />
          <TextInput
            label='Category Name'
            placeholder='Something New'
            className="w-full"
            padding={1}
          />

          <CustomSelect
            id='bootstrap'
            options={[{
              label: "Hello",
              value: '10'
            },
            {
              label: "Wow",
              value: '20'
            }
            ]}
            // inputProps={{
            //   default: '10'
            // }}
            // hasEmpty
            // variant='outlined'
            value='10'
            label='Category Name'
            placeholder='10'
            className="w-full"
            padding={2}
          // helperText="This is helper text"
          // error={'Please enter this correctly!'}
          /> */}

        {/* <Divider sx={{ mb: 3 }} /> */}

        {/* <div className="flex">
            <CustomButton
              startIcon={<BackIcon />}
              width='20rem'
              title='Go Back' />
            <CustomButton
              mainButton
              padding={2}
              title='Create'
              fullWidth
            />
          </div> 
        </CustomContainer>*/}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
