import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import PanelSegmentation from 'components/PanelSegmentation'
import router, {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'
import {submissionsApi} from 'lib/api/submissions'
import {useQuery} from '@tanstack/react-query'
import {toSearchQuery} from 'lib/utils'

export default function Branches({setLoading}) {
  return (
    <Layout
      meta={{
        title: 'Answers',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Submission Answers',
            description: 'Get all the Submission Answers here',
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
