import {TextField} from '@mui/material'
import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import CustomSelect from 'components/CustomSelect'
import FormBottomWidget from 'components/FormBottomWidget'
import useForm from 'lib/hooks/useForm'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import React, {useEffect} from 'react'
import Layout from '../../../Layout'
import Error from 'components/Error'
import {useQuery} from '@tanstack/react-query'
import {userApi} from 'lib/api/user'
import {get, map} from 'lodash'
import {checklistApi} from 'lib/api/checklist'
import {branchApi} from 'lib/api/branch'
import {schedulesApi} from 'lib/api/schedules'
import {DesktopDatePicker} from '@mui/x-date-pickers'
import {eachDayOfInterval, format, parseISO} from 'date-fns'

function getDatesBetween(from, to) {
  return eachDayOfInterval({
    start: new Date(from),
    end: new Date(to),
  }).map((date) => format(date, 'yyyy-MM-dd'))
}

export default function SchedulesForm({setLoading}) {
  const [backendError, setBackendError] = React.useState<string>('')

  const {data: reports, isLoading: isLoadingReports} = useQuery<any>({
    queryFn: () => checklistApi.get(),
    queryKey: ['checklist'],
  })

  const {data: users, isLoading: isLoadingUser} = useQuery<any>({
    queryFn: () => userApi.get(),
    queryKey: ['users'],
  })

  const {data: branches, isLoading: isLoadingBranch} = useQuery<any>({
    queryFn: () => branchApi.get(),
    queryKey: ['branches'],
  })

  const submitCreate = async () => {
    const payload = {
      ...values,
      assignmentDates: getDatesBetween(values.from, values.to),
      from: undefined,
      to: undefined,
    }
    try {
      setLoading(true)
      await schedulesApi.create(payload)
      router.back()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {
      from: new Date(),
      to: new Date(),
    },
    // validationSchema:
    onSubmit: submitCreate,
  })

  useEffect(() => {
    setLoading(isLoadingReports || isLoadingUser || isLoadingBranch)
  }, [isLoadingReports, isLoadingUser, isLoadingBranch])

  return (
    <Layout
      meta={{
        title: 'Add Schedules',
      }}
    >
      <CustomLabel size="bigTitle">{'Add Schedules'}</CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {'Create a new Schedules'}
      </CustomLabel>

      <CustomContainer
        style={{
          overflow: 'hidden',
        }}
        className="overflow-hidden mb-14"
        radius="medium"
        type="secondary"
        padding={3}
      >
        <CustomSelect
          id="bootstrap"
          options={reports?.reports?.map((question) => ({
            label: question?.title,
            value: question?._id,
          }))}
          inputProps={{
            default: '1',
          }}
          value={values.reports || []}
          label="reports"
          helperText="Choose reports"
          className="w-full"
          // onChange={({target: {name, value}}) =>
          //   handleChange('reportId', value)
          // }
          onChange={({target: {value}}) => {
            const newValue = Array.isArray(value)
              ? value
              : [...(value || []), value]
            handleChange('reports', newValue)
          }}
          padding={2}
          multiple={true}
        />

        <CustomSelect
          id="bootstrap"
          options={users?.users?.map((question) => ({
            label: question?.name?.en,
            value: question?._id,
          }))}
          inputProps={{
            default: '1',
          }}
          value={values.userId}
          label="User"
          helperText="Choose User"
          className="w-full"
          onChange={({target: {name, value}}) => handleChange('userId', value)}
          padding={2}
        />

        <CustomSelect
          id="bootstrap"
          options={branches?.branches?.map((branch) => ({
            label: branch?.name?.en,
            value: branch?._id,
          }))}
          inputProps={{
            default: '1',
          }}
          value={values.branches || []}
          label="Branch"
          helperText="Choose branch"
          className="w-full"
          // onChange={({target: {name, value}}) => handleChange('userId', value)}
          onChange={({target: {value}}) => {
            const newValue = Array.isArray(value)
              ? value
              : [...(value || []), value]
            handleChange('branches', newValue)
          }}
          padding={2}
          multiple={true}
        />

        <>
          <DesktopDatePicker
            label="From"
            value={values.from}
            onChange={(value) => handleChange('from', value)}
            renderInput={(props) => <TextField {...props} />}
          />

          <DesktopDatePicker
            label="to"
            value={values.to}
            onChange={(value) => handleChange('to', value)}
            renderInput={(props) => <TextField {...props} />}
          />
        </>

        <Error backendError={backendError} />

        <FormBottomWidget
          isEdit={false}
          onSubmit={() => {
            handleSubmit()
          }}
        />
      </CustomContainer>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
