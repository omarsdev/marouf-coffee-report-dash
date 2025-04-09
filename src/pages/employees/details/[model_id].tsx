import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import PanelSegmentation from 'components/PanelSegmentation'
import router, {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import Layout from '../../../Layout'
import {redirectGuest} from '../../_app'
import ModelList from './ModelList'
import {useQuery} from '@tanstack/react-query'
import {userApi} from 'lib/api/user'

export default function Employees({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () => userApi.getId(String(model_id)),
    queryKey: ['users' + model_id],
    select: (data) => {
      setLoading(false)
      return data
    },
  })

  useEffect(() => {
    setLoading(true)
  }, [])

  return (
    <Layout meta={'Employee Details'}>
      <PanelSegmentation
        panels={[
          {
            title: `${data?.user?.name?.en} Submissions`,
            description: `Get Submissions here info of ${data?.user?.name?.en} here`,
            component: <ModelList areaMangerName={data?.user?.name?.en} />,
            button: (
              <CustomButton
                onClick={() => {
                  router.push('/employees/form/new')
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
