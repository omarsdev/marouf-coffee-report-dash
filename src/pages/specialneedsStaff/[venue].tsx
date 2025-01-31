import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import CustomLabel from 'components/CustomLabel'
import PanelSegmentation from 'components/PanelSegmentation'
import {useStore} from 'lib/store/store'
import router, {useRouter} from 'next/router'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'

export default function Staff(props) {
  const {
    query: {venue: query},
  } = useRouter()
  const {user} = useStore()
  React.useEffect(() => {
    console.log('user', user)
  }, [])
  return (
    <Layout
      meta={{
        title: 'Special Needs Teachers',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Special Needs Teachers',
            description: 'Edit and delete Teacher',
            component: (
              <ModelList
                query={'64736133d682e100148c0222'}
                setLoading={props.setLoading}
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
