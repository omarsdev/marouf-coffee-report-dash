import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import CustomSelect from 'components/CustomSelect'
import FormBottomWidget from 'components/FormBottomWidget'
import TextInput from 'components/TextInput'
import useForm from 'lib/hooks/useForm'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import React, {useEffect} from 'react'
import Layout from '../../../Layout'
import Error from 'components/Error'
import {useQuery} from '@tanstack/react-query'
import {userApi} from 'lib/api/user'
import {get} from 'lodash'
import {branchApi} from 'lib/api/branch'
import {departmentsApi} from 'lib/api/departments'
import {ticketsApi} from 'lib/api/tickets'
import CustomImage from 'components/CustomImage'
import {Box} from '@mui/material'
import * as Yup from 'yup'
import clsx from 'clsx'

export default function TicketsForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'

  const [backendError, setBackendError] = React.useState<string>('')

  const {data, isLoading} = useQuery<any>({
    queryFn: () => ticketsApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['ticket' + model_id.toString()],
    select: (data) => {
      return data
    },
  })

  const {data: branches, isLoading: isLoadingBranch} = useQuery<any>({
    queryFn: () => branchApi.get(),
    queryKey: ['branches'],
  })

  const {
    data: departments,
    isLoading: isLoadingDepartments,
    isError,
    refetch,
  } = useQuery<any>({
    queryFn: () => departmentsApi.get(),
    queryKey: ['departments'],
  })

  const submitCreate = async () => {
    try {
      setLoading(true)
      await ticketsApi.create({...values})
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
      await ticketsApi.edit(model_id.toString(), {...values})
      router.back()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const validationSchema = Yup.object().shape({
    ...(isEditting && {
      transfer_note: Yup.string().trim().required('Transfer note is required'),
    }),
  })

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {},
    validationSchema: validationSchema,
    onSubmit: isEditting ? submitUpdate : submitCreate,
  })

  console.log({errors})
  useEffect(() => {
    setLoading(isLoading || isLoadingBranch || isLoadingDepartments)
  }, [isLoading, isLoadingBranch, isLoadingDepartments])

  useEffect(() => {
    if (!data || !isEditting) {
      return
    }
    const chosenKeys = [
      'status',
      'priority',
      'branch',
      'user',
      'ticket_title',
      'ticket_description',
      ...(data?.ticket?.department ? ['department'] : []),
      ...(data?.ticket?.progress_note ? ['progress_note'] : []),
      ...(data?.ticket?.transfer_note ? ['transfer_note'] : []),
      ,
    ]
    chosenKeys.map((key) => handleChange(key, String(get(data.ticket, key))))
  }, [data, isEditting])

  return (
    <Layout
      meta={{
        title: isEditting ? 'Edit Ticket' : 'Add Ticket',
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? 'Edit Ticket' : 'Add Ticket'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? 'Edit an existing Ticket' : 'Create a new Ticket'}
      </CustomLabel>

      <CustomContainer
        style={{
          overflow: 'hidden',
        }}
        className={clsx('overflow-hidden mb-14 width-[82%] sm:w-full')}
        radius="medium"
        type="secondary"
        padding={3}
      >
        {isEditting &&
          data?.ticket &&
          data?.ticket?.ticket_images?.length > 0 && (
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                justifyContent:
                  data?.ticket?.ticket_images?.length > 2 ? 'center' : 'start',
                paddingBottom: '1rem',
                overflow: 'auto',
              }}
            >
              {data?.ticket?.ticket_images?.map((image) => (
                <a href={image} target="_blank">
                  <CustomImage src={image} />
                </a>
              ))}
            </Box>
          )}

        <TextInput
          label="Tittle"
          className="w-full"
          name="ticket_title"
          value={values.ticket_title}
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Description"
          className="w-full"
          value={values.ticket_description}
          name="ticket_description"
          onChange={handleChange}
          padding={1}
        />

        <CustomSelect
          id="bootstrap"
          options={[
            {
              label: 'Low',
              value: '0',
            },
            {
              label: 'Medium',
              value: '1',
            },
            {
              label: 'High',
              value: '3',
            },
          ]}
          inputProps={{
            default: '1',
          }}
          value={values.priority}
          label="Priority"
          helperText="Choose Ticket Priority"
          className="w-full"
          onChange={({target: {name, value}}) =>
            handleChange('priority', value)
          }
          padding={2}
        />

        {isEditting && (
          <TextInput
            label="Progress Note"
            className="w-full"
            value={values?.progress_note}
            name="progress_note"
            onChange={handleChange}
            padding={1}
          />
        )}

        <CustomSelect
          id="bootstrap"
          options={[
            {
              label: 'In Progress',
              value: '0',
            },
            {
              label: 'Completed',
              value: '1',
            },
          ]}
          inputProps={{
            default: '1',
          }}
          value={values.status}
          label="Status"
          helperText="Choose Ticket Status"
          className="w-full"
          onChange={({target: {name, value}}) => handleChange('status', value)}
          padding={2}
        />

        <CustomSelect
          id="bootstrap"
          options={
            branches?.branches?.map((branch) => ({
              label: branch?.name?.en,
              value: branch?._id,
            })) || []
          }
          inputProps={{
            default: '1',
          }}
          value={values.branch}
          label="Branch"
          helperText="Choose branch"
          className="w-full"
          // onChange={({target: {name, value}}) => handleChange('userId', value)}
          onChange={({target: {name, value}}) => handleChange('branch', value)}
          padding={2}
        />

        <CustomSelect
          id="bootstrap"
          options={
            departments?.departments?.map((department) => ({
              label: department?.department_name?.en,
              value: department?._id,
            })) || []
          }
          inputProps={{
            default: '1',
          }}
          value={values.department || []}
          label="Departments"
          helperText="Choose department"
          className="w-full"
          onChange={({target: {name, value}}) =>
            handleChange('department', value)
          }
          padding={2}
        />
        {isEditting && (
          <TextInput
            label="Transfer Note"
            className="w-full"
            value={values?.transfer_note}
            name="transfer_note"
            onChange={handleChange}
            padding={1}
            required
          />
        )}

        <Error backendError={backendError || errors?.transfer_note} />

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
