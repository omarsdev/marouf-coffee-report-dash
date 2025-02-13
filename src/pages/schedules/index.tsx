import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import CustomLabel from 'components/CustomLabel'
import PanelSegmentation from 'components/PanelSegmentation'
import useStore from 'lib/store/store'
import router from 'next/router'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'

export default function Branches(props) {
  return (
    <Layout
      meta={{
        title: 'Schedules',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Schedules',
            description: 'Get all the Schedules here',
            component: <ModelList />,
            button: (
              <CustomButton
                onClick={() => {
                  router.push('/schedules/new')
                }}
                startIcon={<GridAddIcon />}
                width="10rem"
                title="Create"
              />
            ),
          },
        ]}
      />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
