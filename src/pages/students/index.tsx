import PanelSegmentation from 'components/PanelSegmentation'
import {useStore} from 'lib/store/store'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'



export default function Students(props) {
  const {user} = useStore()

  return (
    <Layout
      meta={{
        title: 'Students',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Students',
            description: "See and edit Darsi' students",
            component: (
              <>
              <ModelList setLoading={props.setLoading} />,
              
              </>
            )
          },
        ]}
      />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
