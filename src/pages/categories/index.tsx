import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import CustomLabel from 'components/CustomLabel'
import PanelSegmentation from 'components/PanelSegmentation'
import {useStore} from 'lib/store/store'
import router from 'next/router'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'

export default function Branches(props) {
  const {user} = useStore()
  React.useEffect(() => {
    console.log('user', user)
  }, [])
  return (
    <Layout
      meta={{
        title: 'Categories',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Categories',
            description: "See and edit Darsi' categories",
            component: <ModelList />,
            button: (
              <CustomButton
                onClick={() => {
                  router.push('/categories/form/new')
                }}
                startIcon={<GridAddIcon />}
                width="10rem"
                title="Add Category"
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
