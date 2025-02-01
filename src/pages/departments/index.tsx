import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import PanelSegmentation from 'components/PanelSegmentation'
import router from 'next/router'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'

export default function Departments(props) {
  return (
    <Layout
      meta={{
        title: 'Departments',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Departments',
            description: 'Get all the Departments here',
            component: <ModelList />,
            button: (
              <CustomButton
                onClick={() => {
                  router.push('/departments/form/new')
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
