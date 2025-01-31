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
        title: 'Special Needs',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Special Needs',
            description: "See and edit Darsi' Special Needs",
            component: <ModelList />,
            button: (
              <CustomButton
                onClick={() => {
                  router.push('/special-needs/form/new')
                }}
                startIcon={<GridAddIcon />}
                width="12.5rem"
                title="Add Special Need"
              />
            ),
          },
          // {
          //     title: "Branch Users",
          //     description: "Add employees to each branch and pair their phone",
          //     component: <div>3</div>,
          //     button: <CustomButton
          //         onClick={() => { () => { } }}
          //         startIcon={<GridAddIcon />}
          //         width='13rem'
          //         title='Add Branch User' />
          // },
          // {
          //     title: "Map",
          //     description: "Branch location projection (similar to application)",
          //     component: <div>4</div>,
          // },
        ]}
      />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
