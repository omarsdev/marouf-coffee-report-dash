import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import PanelSegmentation from 'components/PanelSegmentation'
import router from 'next/router'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'
import useStore from 'lib/store/store'

export default function Departments(props) {
  const {user} = useStore()

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
            button: user?.role === 0 && (
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
