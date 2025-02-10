import PanelSegmentation from 'components/PanelSegmentation'
import React from 'react'
import Layout from '../../../Layout'
import {redirectGuest} from '../../_app'
import ModelList from './ModelList'

export default function Branches({setLoading}) {
  return (
    <Layout
      meta={{
        title: 'Submissions',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Submissions',
            description: 'Get all the Checklist here',
            component: <ModelList />,
          },
        ]}
      />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
