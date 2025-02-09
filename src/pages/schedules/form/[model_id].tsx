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
export default function SchedulesForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'

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

  const {data: schedule, isLoading: isLoadingChecklist} = useQuery<any>({
    queryFn: () => schedulesApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['schedule' + model_id.toString()],
    select: (data) => {
      const chosenKeys = ['dueDate', 'assignedAt']
      handleChange('reportId', data?.assignment?.reportId?._id)
      handleChange('branches', [data?.assignment?.branch])
      handleChange('userId', data?.assignment?.userId?._id)
      chosenKeys.map((key) => handleChange(key, get(data?.assignment, key)))
      return data
    },
  })

  const submitCreate = async () => {
    try {
      setLoading(true)
      await schedulesApi.create({...values})
      router.back()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }
  const submitUpdate = async () => {
    try {
      setLoading(true)
      await schedulesApi.update(model_id.toString(), {...values})
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
      assignedAt: new Date(),
      dueDate: new Date(),
    },
    // validationSchema:
    onSubmit: isEditting ? submitUpdate : submitCreate,
  })

  useEffect(() => {
    if (isEditting) {
      setLoading(isLoadingChecklist)
    } else {
      setLoading(
        isLoadingChecklist ||
          isLoadingReports ||
          isLoadingUser ||
          isLoadingBranch,
      )
    }
  }, [isLoadingChecklist, isLoadingReports, isLoadingUser, isLoadingBranch])

  return (
    <Layout
      meta={{
        title: isEditting ? 'Edit Schedules' : 'Add Schedules',
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? 'Edit Schedules' : 'Add Schedules'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? 'Edit an existing Schedules' : 'Create a new Schedules'}
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
          value={values.reportId}
          label="reports"
          helperText="Choose reports"
          className="w-full"
          onChange={({target: {name, value}}) =>
            handleChange('reportId', value)
          }
          padding={2}
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

        <DesktopDatePicker
          label="Assigned At"
          value={values.assignedAt}
          onChange={(value) => handleChange('assignedAt', value)}
          renderInput={(props) => <TextField {...props} />}
        />

        <DesktopDatePicker
          label="Due Date"
          value={values.dueDate}
          onChange={(value) => handleChange('dueDate', value)}
          renderInput={(props) => <TextField {...props} />}
        />

        <Error backendError={backendError} />

        <FormBottomWidget
          isEdit={isEditting}
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
