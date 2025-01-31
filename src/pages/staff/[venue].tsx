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
        title: 'Teachers',
      }}
    >
      <PanelSegmentation
        teacher
        panels={[
          {
            title: 'Teachers',
            description: 'Add, edit and delete Teacher',
            component: (
              <ModelList
                query={'64736133d682e100148c0222'}
                setLoading={props.setLoading}
              />
            ),
            button: (
              <CustomButton
                onClick={() => {
                  router.push({
                    pathname: '/staff/form/[model_id]',
                    query: {
                      model_id: '64736133d682e100148c0222' + '___new',
                    },
                  })
                }}
                startIcon={<GridAddIcon />}
                width="10rem"
                title="Add Teacher"
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
