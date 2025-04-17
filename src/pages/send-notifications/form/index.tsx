import React, {useEffect, useState} from 'react'
import {Checkbox, FormControlLabel} from '@mui/material'
import {useInfiniteQuery, useQuery} from '@tanstack/react-query'
import {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import Layout from '../../../Layout'
import CustomLabel from 'components/CustomLabel'
import CustomContainer from 'components/CustomContainer'
import CustomSelect from 'components/CustomSelect'
import TextInput from 'components/TextInput'
import FormBottomWidget from 'components/FormBottomWidget'
import Error from 'components/Error'
import useForm from 'lib/hooks/useForm'
import {userApi} from 'lib/api/user'
import {sendNotificationsApi} from 'lib/api/sendNotifications'
import {toSearchQuery} from 'lib/utils'

export default function SendNotificationForm() {
  const router = useRouter()
  const [backendError, setBackendError] = useState('')
  const [selectAll, setSelectAll] = useState(false)

  const {values, errors, handleChange, handleSubmit} = useForm({
    initial: {
      title: '',
      description: '',
      users: [],
    },
    onSubmit: async () => {
      try {
        // setLoading(true)
        const payload = {
          ...values,
          users: selectAll ? [] : values.users,
        }
        await sendNotificationsApi.create(payload)
        router.back()
      } catch (e) {
        console.error(e)
        setBackendError(e?.message)
      } finally {
        // setLoading(false)
      }
    },
  })

  console.log({values})

  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingUsers,
  } = useInfiniteQuery({
    enabled: router.isReady,
    queryFn: async ({pageParam = 1}) => {
      try {
        const response: any = await userApi.get(
          toSearchQuery({pageNumber: pageParam, pageSize: 20}),
        )
        return response?.users ? response : {users: [], count: 0}
      } catch (error) {
        console.error('API Error:', error)
        return {users: [], count: 0}
      }
    },
    queryKey: ['users', router.isReady],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage.users)) return undefined
      const totalFetched = allPages.reduce(
        (sum, page) => sum + (page?.users?.length || 0),
        0,
      )
      return totalFetched < (lastPage?.count || 0)
        ? allPages?.length + 1
        : undefined
    },
  })

  const userOptions = React.useMemo(() => {
    return (
      usersData?.pages.flatMap((page: any) =>
        page.users.map((user) => ({
          label: user.name?.en,
          value: user._id,
        })),
      ) || []
    )
  }, [usersData])

  return (
    <Layout meta={{title: 'Send Notification'}}>
      <CustomLabel size="bigTitle">Send Notification</CustomLabel>
      <CustomLabel type="secondary" padding={3} size="normal">
        Fill out the details to send a notification
      </CustomLabel>

      <CustomContainer
        className="overflow-hidden mb-14"
        radius="medium"
        type="secondary"
        padding={3}
      >
        <TextInput
          label="Title"
          name="title"
          className="w-full"
          value={values.title}
          onChange={handleChange}
          padding={1}
        />

        <TextInput
          label="Description"
          name="description"
          className="w-full mt-4"
          multiline
          value={values.description}
          onChange={handleChange}
          padding={1}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={(e) => setSelectAll(e.target.checked)}
            />
          }
          label="Send to all users"
          className="mt-4"
        />

        {!selectAll && (
          <CustomSelect
            id="user-select"
            options={userOptions}
            label="User"
            className="w-[2rem]"
            onChange={({target: {value}}) => handleChange('users', value)}
            value={values.users}
            padding={2}
            multiple
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoadingUsers}
            hasEmpty={true}
          />
        )}

        <Error backendError={backendError} />

        <FormBottomWidget isEdit={false} onSubmit={() => handleSubmit()} />
      </CustomContainer>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
