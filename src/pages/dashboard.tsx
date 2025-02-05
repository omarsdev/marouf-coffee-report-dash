import React from 'react'
import Head from 'next/head'
import Layout from '../Layout'
import CustomLabel from 'components/CustomLabel'
import {redirectGuest} from './_app'

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
      </div>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
