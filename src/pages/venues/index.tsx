import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import PanelSegmentation from 'components/PanelSegmentation'
import {useStore} from 'lib/store/store'
import router from 'next/router'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import VenuesList from './VenuesList'

export default function Venues(props) {
  const {user} = useStore()
  React.useEffect(() => {
    console.log('user', user)
  }, [])
  return (
    <Layout
      meta={{
        title: 'Venues',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Venues',
            description: 'See and edit your company Venues',
            component: <VenuesList />,
            button: (
              <CustomButton
                onClick={() => {
                  router.push('/venues/form/new')
                }}
                startIcon={<GridAddIcon />}
                width="10rem"
                title="Add Venue"
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
